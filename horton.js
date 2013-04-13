(function($,w,undefined){
    //
    // Determine the viewport width.
    //
    function viewportWidth(opts) {
	var wd = window.innerWidth ||
	    (document.body ? document.body.offsetWidth : 0);
	if (opts.testBreakpoint != null &&
	    opts.breakpoints[opts.testBreakpoint] < wd)
	    wd = opts.breakpoints[opts.testBreakpoint];
	return wd;
    }
    //
    // Whenever the viewport resizes, make sure all the tables are adjusted.
    //
    function resizeAll() {
	$('table.hortonified').each(function(){
		toggleExpander($(this),resizeHorton($(this)));
	    });
    }
    //
    // Re-calculate which columns to show and hide when the window changes
    // size.
    //
    function resizeHorton($table) {
	var i, s, e, needExpander = false,
	$tbody = $table.find('tbody:first'),
	opts = $table.data('horton');

	var id = $table.attr('id');
	opts.timer = null;

	//
	// Find the pivotal breakpoint.
	//
	var vwd = viewportWidth(opts), hide=['always','initial'], show=[];
	$.each(opts.bkpt,function(k,v){
	    if (v.width>=vwd) hide.push(v.name); else show.push(v.name);
	});

	//
	// Collect a list of rows that have details rows open and
	// close them.
	//
	var reopen = $table.find('>tbody:first>tr.'+opts.classes.expanded).trigger('click.horton');

	//
	// Show columns that should be visible.
	//
	for (i = 0; i < show.length; i++) {
	    var expr = ">thead:first>tr:last-child>th[data-hide*='"+show[i]+"'],>thead:first>tr:last-child>td[data-hide*='"+show[i]+"']";
	    $table.find(expr).each(function(){
		var s, e, $th = $(this),
		span = opts.columnData[$th.index()].span;

		if (typeof(span) === 'object') {
		    s = span[0];
		    e = span[1]+1;
		} else {
		    s = span;
		    e = s+1;
		}
		$th.show();
		$tbody.children('tr').each(function(){
		    $(this).children('td').slice(s,e).show();
		});
	    });
	}

	//
	// Hide columns that should not be visible.
	//
	for (i = 0; i < hide.length; i++) {
	    var expr = ">thead:first>tr:last-child>th[data-hide*='"+hide[i]+"'],>thead:first>tr:last-child>td[data-hide*='"+hide[i]+"']";
	    $table.find(expr).each(function(){
		var s, e, $th = $(this),
		span = opts.columnData[$th.index()].span;

		if (hide[i] != 'always')
		    needExpander = true;
		if (typeof(span) === 'object') {
		    s = span[0];
		    e = span[1]+1;
		} else {
		    s = span;
		    e = s+1;
		}
		$th.hide();
		$tbody.children('tr').each(function(){
		    $(this).children('td').slice(s,e).hide();
		});
	    });
	}

	//
	// If some columns are still hidden, reopen the details rows
	// that were showing before the viewport width change.
	//
	if (needExpander && reopen)
	    $(reopen).trigger('click.horton');

	//
	// If a test breakpoint is in use, adjust the table to fit
	// within the width specified.
	//
	if (opts.testBreakpoint)
	    //
	    // TODO
	    //
	    // This needs to be changed to deal with tables that do
	    // not start at the left margin. Change it so it uses
	    // table position and width to adjust to fit within the
	    // test viewport width.
	    //
	    $table.width(vwd);
	else
	    $table.width(opts.tableWidth);

	return needExpander;
    }
    //
    // Toggle the display or hiding of the images indicating whether a
    // row has cells that are hidden that can be shown.
    //
    function toggleExpander($table,on) {
	var opts = $table.data('horton');

	//
	// All the details rows are collapsed at this point.
	//
	if (on)
	    $table.find('>tbody:first>tr:not(.horton-details)>td:nth-child('+opts.expanderColumn+')').addClass(opts.classes.collapsed);
	else
	    $table.find('>tbody:first>tr>td:nth-child('+opts.expanderColumn+')').removeClass(opts.classes.collapsed);

	opts.expander = on;
    }
    //
    // Initialize the tables.
    //
    function hortonInit(w,options) {
	options = options || {};

	return this.each(function(){
	    $table = $(this);
	    //
	    // Either get the existing set of options from the table
	    // or add the options for the first time.
	    //
	    if ($table.data('horton'))
		opts = $.extend(true,$table.data('horton'),options);
	    else
		opts = $.extend(true,{},w.horton.options,options);
	    $table.data('horton',opts);

	    //
	    // Clear the arrays that will be built up.
	    //
	    opts.bkpt.length = opts.columnData.length = 0;

	    //
	    // Create a sorted array of breakpoints.
	    //
	    $.each(opts.breakpoints, function(k,v){opts.bkpt.push({name:k,width:v});});
	    opts.bkpt.sort(function(a,b){return a['width']-b['width'];});

	    //
	    // Collect the column data from the table head.
	    //
	    var cidx = 0;
	    $table.find('>thead:first>tr:last-child>th,>thead:first>tr:last-child>td').each(function(){
		var $th = $(this),
		colspan = $th.attr('colspan') ?
		    parseInt($th.attr('colspan')) : 1;

		if (/always/.test($th.data('hide')))
		    //
		    // If data-hide contains 'always', remove
		    // everything else because 'always' takes precedence.
		    //
		    $th.data('hide','always');

		//
		// Record the position of the expander column.
		//
		if ($th.data('expander'))
		    opts.expanderColumn = cidx + 1;

		var data = {
		    'index': $th.index(),
		    'name': $th.data('name') || $.trim($th.text()),
		    'text': $.trim($th.text()),
		    'hide': $th.data('hide'),
		    'span': null
		};
		//
		// Add the span which is useful for hiding and showing
		// columns.
		//
		if (colspan > 1)
		    data.span = [cidx,cidx+colspan-1];
		else
		    data.span = cidx;

		opts.columnData[data.index] = data;
		//
		// Update the map that allows cells to refer back to
		// their column headers.
		//
		for (var i = 0; i < colspan; i++,cidx++)
		    opts.toColumnData[cidx] = data.index;
	    });
	    //
	    // Do the initial resize manually and show or hide the expander
	    // images appropriately.
	    //
	    toggleExpander($table,resizeHorton($table));

	    //
	    //
	    $table.off('click.horton').on('click.horton',
					  '>tbody:first>tr:not(.horton-details)',
					  manageDetails);
	    //
	    // Add the class that indicates the table has been
	    // initialized.  This is primarily used to resize all
	    // tables that have had this plugin applied to them..
	    //
	    $table.addClass('hortonified');
            //
            // Let the plugins do their own initialization of the table at
            // this point.
            //
            w.horton.plugins.init(w,$table);
	    //
	    // Add the window resize handler.
	    //
	    $(w).unbind('resize.horton').bind('resize.horton',
					      function() {
						  clearTimeout(opts.timer);
						  opts.timer=setTimeout(resizeAll(),opts.delay);
					      });
	});
    }
    //
    // Build a default HTML string of the details to be added to the
    // container.
    //
    function showDetails(opts,visible,hidden,container) {
	for (var i = 0, h = ''; i < hidden.length; i++) {
	    h += "<div><span class='horton' style='font-weight:bold;text-decoration:underline'>"+hidden[i].columnData.text+"</span><br>";
	    for (var j = 0; j < hidden[i].elements.length; j++) {
		var $e = $(hidden[i].elements[j]),
		    v = $e.text();
		h += "<span class='horton' style='margin-left:10px'>"+v+"</span><br>";
	    }
	    h += "</div>";
	}
	$(container).html(h);
    }
    //
    // The default function that shows or hides the hidden details.
    //
    function manageDetails(event) {
	var $row = $(this),
	opts = $row.parents('table:first').data('horton');
	//
	// All of the cells that can be visible, are visible.
	//
	if (!opts.expander)
	    return;

	var rcl,acl,cd,nvis,nhid,
	    hid = $row.children('td:hidden'),
	    vis = $row.children('td:visible'),
	    vsibs = $(vis).size(),
	    hidden = null,
	    visible = null;

	//
	// Create a list of the visible cells.
	//
	var i = 0;
	while (i < vis.length) {
	    cd = opts.columnData[opts.toColumnData[$(vis[i]).index()]];
	    nvis = (typeof(cd.span) === 'object') ?
		(cd.span[1]-cd.span[0])+1:1;
	    var vdata = {
		columnData: cd,
		elements: $(vis).slice(i,i+nvis)
	    };
	    if (visible == null)
		visible = [vdata];
	    else
		visible.push(vdata);
	    i += nvis;
	}
	
	//
	// Create the list of the hidden cells.
	//
	i = 0;
	while (i < hid.length) {
	    //
	    // Get the column data for this cell.
	    //
	    var cd = opts.columnData[opts.toColumnData[$(hid[i]).index()]],
		nhid = (typeof(cd.span) === 'object')?
		(cd.span[1]-cd.span[0])+1:1;
	    //
	    // Only show details that are not always hidden.
	    //
	    if (cd.hide != 'always') {
		var ddata = {
		    columnData: cd,
		    elements: $(hid).slice(i,i+nhid)
		};
		if (hidden == null)
		    hidden = [ddata];
		else
		    hidden.push(ddata);
	    }
	    i += nhid;
	}
	var $next = $row.next(), container;
	if ($row.hasClass(opts.classes.expanded)) {
	    //
	    // Call the callback if one has been provided.
	    //
	    if (opts.hideDetails) {
		container = $next.children('td:first');
		opts.hideDetails(opts,visible,hidden,container);
	    }
	    $next.hide();
	    rcl = opts.classes.expanded;
	    acl = opts.classes.collapsed;
	} else {
	    if (!$next || !$next.hasClass('horton-details')) {
		$next = $("<tr class='horton-details'><td colspan='"+vsibs+"'></td></tr>");
		$row.after($next);
	    } else {
		//
		// It is possible that the column span will change at
		// this point.
		//
		$next.find('td:first').attr('colspan',vsibs);
	    }
	    container = $next.children('td:first').empty();
	    //
	    // Call the callback if one has been provided.
	    //
	    if (opts.showDetails)
		opts.showDetails(opts,visible,hidden,container);
	    else
		//
		// No details function was provided, so use the
		// default.
		//
		showDetails(opts,visible,hidden,container);
	    //
	    // Show the row.
	    //
	    $next.show();
	    rcl = opts.classes.collapsed;
	    acl = opts.classes.expanded;
	}
	$row.removeClass(rcl).addClass(acl);
	$row.find(':nth-child('+opts.expanderColumn+')').removeClass(rcl).addClass(acl);
    }
    //
    // Given an array of rows, hide the columns that need to be hidden
    // and add the expander to the appropriate column.
    //
    function fiddleRows(opts,$table,$rows) {
	var vwd = viewportWidth(opts), hide=['always'];
	$.each(opts.bkpt,function(k,v){
		if (v.width>=vwd)
		    hide.push(v.name);
	    });
	for (var i = 0; i < hide.length; i++) {
	    var expr = ">thead:first>tr:last-child>th[data-hide*='"+hide[i]+"'],>thead:first>tr:last-child>td[data-hide*='"+hide[i]+"']";
	    $table.find(expr).each(function(){
		    var s, e, $th = $(this),
			span = opts.columnData[$th.index()].span;

		    if (hide[i] != 'always')
			needExpander = true;
		    if (typeof(span) === 'object') {
			s = span[0];
			e = span[1]+1;
		    } else {
			s = span;
			e = s+1;
		    }
		    $rows.each(function(){$(this).children('td').slice(s,e).hide();});
		});
	}
	//
	// All of the cells that should be are visible, so no expander
	// indicator is needed.
	//
	if (!opts.expander)
	    return;

	//
	// Add the expander class to the appropriate cell in each row.
	//
	$rows.find('>td:nth-child('+opts.expanderColumn+')').addClass(opts.classes.collapsed);
    }
    /************************************************************************
     *
     * Public interface.
     *
     ************************************************************************/
    //
    // Get the table options.
    //
    function getOptions() {
	return $(this).data('horton');
    }
    //
    // Get the Horton version and versions of all it's plugins.
    //
    function getVersion() {
        var vers,
        opts = $(this).data('horton'),
        reg = w.horton.plugins.registered;

        //
        // If there are no child plugins, just return the version.
        //
        if (reg.length == 0)
	    return opts.version;

        //
        // Construct an object with the plugin version and the versions of
        // its children plugins.
        //
        vers = [{name: "Horton", version: opts.version}];
        for (var i = 0; i < reg.length; i++)
            vers.push({name: reg[i].name, version: reg[i].version});
        return vers;
    }
    //
    // Return the number of table rows minus the number of details rows.
    //
    function numRows() {
	var $table = this,
	    opts = $table.data('horton');

	return $table.get(0).tBodies[0].rows.length -
            $table.find('tr.horton-details').size();
    }
    //
    // Replace the specified rows.
    //
    // replaceRows(newRows)
    //   Replace all table rows with new set of rows. If newRows is null,
    //   all rows are simply deleted.
    //
    // replaceRows(insertPoint,newRows)
    //   Insert new rows *before* the insertPoint. If newRows is null,
    //   nothing happens.
    //
    // replaceRows(from,to,newRows)
    //   Delete the rows between from and to-1 and insert the new rows.
    //   If newRows is null, then this is a simple delete operation.
    //
    // newRows can be a string with HTML or a set of DOM row elements.
    //
    function replaceRows() {
	var $nr = null,
	    from = -1,
	    to = -1,
	    $table = $(this),
	    opts = $table.data('horton');

	if (arguments.length > 0) {
	    var o = arguments[arguments.length-1];
	    $nr = (typeof(o) === 'object') ? o : $(o);
	}
	if (arguments.length < 2) {
	    //
	    // Hide all detail rows that are showing.
	    //
	    if (opts.hideDetails)
		$table.find('>tbody:first>tr.'+opts.classes.expanded).trigger('click.horton');
	    //
	    // Delete all rows.
	    //
	    $table.find('>tbody:first>tr').remove();
	    //
	    // Insert the new rows.
	    //
	    if ($nr) {
		fiddleRows(opts,$table,$nr);
		$table.find('>tbody:first').append($nr);
	    }
	    $table.trigger('horton.rows.modified');
	    return;
	}

	if (arguments.length == 2)
	    from = to = (typeof(arguments[0] === 'number')) ?
		arguments[0] : parseInt(arguments[0]);
	else if (arguments.length == 3) {
	    from = (typeof(arguments[0] === 'number')) ?
		arguments[0] : parseInt(arguments[0]);
	    to = (typeof(arguments[1] === 'number')) ?
		arguments[1] : parseInt(arguments[1]);
	}
	if (isNaN(from))
	    $.error('Horton: The "from" parameter is not a number.');
	if (isNaN(to))
	    $.error('Horton: The "to" parameter is not a number.');

	if (from < 0)
	    return;

	//
	// Hide columns that need to be hidden in the incoming rows.
	//
	fiddleRows(opts,$table,$nr);

	//
	// Locate the 'from' row, ignoring details rows.
	//
	var rows = $table.get(0).tBodies[0].rows;
	for (var i = 0, ri = 0; ri < from && i < rows.length; i++) {
	    if (!$(rows[i]).hasClass('horton-details'))
		ri++;
	}
	var insertPoint = i;
	//
	// Locate the 'to' row, closing details rows and deleting the rows
	// as we go.
	//
	for (; ri < to && i < rows.length; i++) {
	    if (!$(rows[i]).hasClass('horton-details'))
		ri++;
	    if ($(rows[i]).hasClass(opts.classes.expanded)) {
		$(rows[i]).trigger('click.horton');
	    }
	}
	//
	// Remove any rows that are being replaced.
	//
	if (i > insertPoint)
	    $(rows).slice(insertPoint,i).remove();
	if (insertPoint == rows.length)
	    $(rows[insertPoint-1]).after($nr);
	else
	    $(rows[insertPoint]).before($nr);
	$table.trigger('horton.rows.modified');
    }
    //
    // Set up the globals.
    //
    w.horton = {
	options: {
	    //
	    // The version of this plugin.
	    //
	    version: {major: 0, minor: 1},
	    //
	    // Delay this long before handling a window resize event. This
	    // avoids processing too many resize events by delaying 1/10
	    // of a second.
	    delay: 100,
	    //
	    // Different width breakpoints for showing and hiding
	    // columns.
	    //
	    breakpoints: {
		phone: 480,
		tablet: 1024
	    },
	    //
	    // All tables have their width set during a resize.
	    //
	    tableWidth: '100%',
	    //
	    // To test the table at a specific viewport width. Used
	    // to test smaller viewports on larger screens.
	    //
	    testBreakpoint: null,
	    //
	    // Function called just before the details row is shown.
	    //
	    showDetails: showDetails,
	    //
	    // Function called just before the details row is hidden.
	    //
	    hideDetails: null,
            classes: {
		collapsed: 'horton-collapsed',
		expanded: 'horton-expanded'
            },
	    //
	    // Internal data.
	    //
	    columnData: [],
	    toColumnData: [],
	    bkpt: [],
	    timer: null,
	    expander: false,
	    expanderColumn: 0
	},
	plugins: {
	    //
	    // Initialize the plugins.
	    //
	    init: function(w,$table){
                var p = w.horton.plugins.registered;
                for (var i = 0; i < p.length; i++) {
                    p[i].init($table,$table.data('horton'));
                }
            },
	    //
	    // Register a plugin.
	    //
	    register: function(w,plugin,options){
                //
                // Do a simple verification of the plugin object.
                //
                if (typeof(plugin.name) !== 'string')
                    $.error('Horton: Invalid plugin name.');
                if (typeof(plugin.version) !== 'object')
                    $.error('Horton: Invalid version specification.');
                else if (typeof(plugin.version.major) === 'undefined' ||
                         typeof(plugin.version.minor) === 'undefined')
                    $.error('Horton: Invalid version specification.');
                if (typeof(plugin.init) !== 'function')
                    $.error('Horton: Invalid plugin init function.');
                //
                // Merge the plugin's defaults with the global options.
                //
                if (typeof(options) === 'object')
                    $.extend(true,w.horton.options,options);
                w.horton.plugins.registered.push(plugin);
            },
	    //
	    // Array of registered plugins.
	    //
	    registered: []
	}
    };

    $.fn.horton = function(req) {
 	var methods = {
	    init       : hortonInit,     // Initialize.
	    version    : getVersion,
	    options    : getOptions,
	    insertRows : replaceRows,
	    replaceRows: replaceRows,
	    numRows    : numRows
	};

	//
	// An object means options and initialization is requested.
	//
	if (typeof(req) === 'object' || !req)
	    return methods.init.apply(this,[w,req]);

	//
	// Call the requested method if it exists.
	//
	if (methods[req]) {
	    return methods[req].apply(this,$(arguments).slice(1));
	}

	//
	// Find the first plugin (if any) that can handle the request.
	//
	var p = w.horton.plugins.registered;
	for (var i = 0; i < p.length && !p[i].methods[req]; i++) {}
	if (i < p.length)
	    return p[i].methods[req].apply(this,$(arguments).slice(1));

	$.error('Horton: Request "'+req+'" is not available on jQuery.horton objects.');
   };
})(jQuery,window);

(function($,w,undefined) {
    if (w.horton == undefined || w.horton == null)
	$.error('Horton: Please make sure horton.js is loaded before this script.');

    function getRows($table,column) {
        var opts = $table.data('horton'), rows = [];

        $table.find(">tbody:first>tr").each(function() {
            var i, $tr = $(this);

            if ($tr.hasClass('horton-details'))
	        return true;

            var $td = $tr.find('td');

            //
            // If a row has either of the collapsed or expanded
            // classes, then it has a details row.
            //
            var row = {row: $tr, detail: null, key: ''}, $next = $tr.next();
	    if ($next && $next.hasClass('horton-details'))
		row.detail = $next;

            //
	    // Create the sort key from the list of cells gathered..
            //
            for (i = 0; i < column.sortWith.length; i++)
                row.key += opts.getSortKey($td[column.sortWith[i]]);
            rows.push(row);
            return true;
        }).remove();

        return rows;
    }

    function sortColumn(ev,desc) {
        var $th = $(this),
        $table = $th.parents('table'),
        $tbody = $table.find('tbody:first'),
        opts = $table.data('horton');

        if (!opts.sort)
            return;

        //
        // Remove the rows from the table.
        //
        var rows = getRows($table,opts.columnData[$th.index()]);

	if ($th.hasClass(opts.classes['sorted-ascending'])) {
	    if (desc != false) {
		$th.removeClass(opts.classes['sorted-ascending']).addClass(opts.classes['sorted-descending']);
		rows.reverse();
		desc = true;
	    }
	} else if ($th.hasClass(opts.classes['sorted-descending'])) {
	    //
	    // Return if the requested sort direction is the same as the
	    // current direction.
	    //
	    if (desc != true) {
		$th.removeClass(opts.classes['sorted-descending']).addClass(opts.classes['sorted-ascending']);
		rows.reverse();
		desc = false;
	    }
	} else {
	    //
	    // Remove the ascending and descending classes from all the
	    // headers.
	    //
	    $table.find('>thead:first>tr:last-child>th,>thead:first>tr:last-child>td').removeClass(opts.classes['sorted-ascending']).removeClass(opts.classes['sorted-descending']);
	    if (desc == true) {
		$th.addClass(opts.classes['sorted-descending']);
		rows.sort(function(a,b){return naturalSort(b.key,a.key);});
	    } else {
		$th.addClass(opts.classes['sorted-ascending']);
		rows.sort(function(a,b){return naturalSort(a.key,b.key);});
		desc = false;
	    }
	}

        //
        // Add the rows back to the table.
        //
        for (var i = 0; i < rows.length; i++) {
	    $tbody.append(rows[i].row);
            if (rows[i].detail)
                $tbody.append(rows[i].detail);
        }
	//
	// Trigger the sorted binding.
	//
	$table.trigger('horton.sorted',
		       [opts.columnData[$th.index()].name,desc]);
    }

    function getSortWith(col, ocol, children) {
        var i, span = ocol.span;

        if (typeof(span) === 'number')
            //
            // This header does not have a colspan, so just include its child
            // column's index.
            //
            col.sortWith.push(span);
        else {
            if (children) {
                //
                // The header has a colspan and the user has specified which
                // child columns to use for sorting.
                //

                //
                // Convert 'children' to an array of integers.
                //
                children = $.map(children.split(","),function(v,i){return parseInt(v);});
                for (i = 0; i < children.length; i++) {
                    if (span[0] + children[i] <= span[1])
                        col.sortWith.push(span[0]+children[i]);
                }
            } else {
                //
                // This header has a colspan, but the user did not specify
                // which columns to use for sorting, just to use the
                // column. So add all the child columns so they will be
                // included in the sort key.
                //
                for (i = span[0]; i <= span[1]; i++)
                    col.sortWith.push(i);
            }
        }
    }

    function hortonSortInit($table,opts) {
	//
	// Add or clear sort indicators on the column.
	//
        $table.find('>thead:first>tr:last-child>th,>thead:first>tr:last-child>td').each(function(){
            $("span",this).removeClass(opts.classes["sort-indicator"]);
            if (opts.sort && !$(this).data('sort-ignore')) {
                if ($(this).children('span').size() == 1)
                    $("span",this).addClass(opts.classes["sort-indicator"]);
                else
                    $(this).append("<span class='"+
                                   opts.classes['sort-indicator']+"'></span>");
            }
        });
        //
        // Process the headers.
        //
        $table.find('>thead:first>tr:last-child>th,>thead:first>tr:last-child>td').each(function(){
	    var sw, $cth,
	    $th = $(this),
	    children = null,
	    cdata = opts.columnData[$th.index()];

            //
            // Build the array of columns this one will sort with for
            // multicolumn sorting.
            //
            if (cdata.sortWith == undefined)
                cdata.sortWith = [];
            else
                cdata.sortWith.length = 0;

	    if (typeof(cdata.span) === 'number')
		cdata.sortWith.push(cdata.span);
	    else {
		//
		// If this header spans multiple columns, then collect the
		// list of columns and their order to use in creating a
		// sort key.
		//
		if ((sw = $th.data('sort-key'))) {
		    //
		    // The header has an ordered list of columns to
		    // use when creating a sort key.
		    //
		    sw = $.map(sw.split(','),function(v,i){return parseInt(v);});
		    for (var i = 0; i < sw.length; i++) {
			if (cdata.span[0] + sw[i] <= cdata.span[1])
			    cdata.sortWith.push(cdata.span[0]+sw[i]);
		    }
		} else {
		    //
		    // Use all the columns to create a sort key.
		    //
		    for (var i = cdata.span[0]; i <= cdata.span[1]; i++)
			cdata.sortWith.push(i);
		}
	    }

            if ((sw = $th.data('sort-with'))) {
		sw = sw.split(',');
                $(sw).each(function(idx,v){
                    //
                    // Trim extraneous whitespace around the column name.
                    //
                    v = $.trim(v);
                    //
                    // Search the columns before this one for the column this
                    // column sorts with.
                    //
                    for (var i = $th.index() - 1;
                         i >= 0 && v != opts.columnData[i].name; i--) {}
                    if (i >= 0) {
			//
			// If the other column header spans multiple
			// columns, determine its sort key (which
			// columns to use for sorting and what order).
			//
			$cth = $table.find('>thead:first>tr:last-child>th:eq('+i+'),>thead:first>tr:last-child>td:eq('+i+')');
                        getSortWith(cdata,opts.columnData[i],
				    $cth.data('sort-key'));
                    } else {
                        //
                        // Matching column name not found. Search the
                        // columns after the current column.
                        //
                        for (i = $th.index() + 1;
                             i < opts.columnData.length && v != opts.columnData[i].name;
                             i++) {}
                        if (i < opts.columnData.length) {
			    //
			    // If the other column header spans
			    // multiple columns, determine its sort
			    // key (which columns to use for sorting
			    // and what order).
			    //
			    $cth = $table.find('>thead:first>tr:last-child>th:eq('+i+'),>thead:first>tr:last-child>td:eq('+i+')');
                            getSortWith(cdata,opts.columnData[i],
					$cth.data('sort-key'));
			}
                    }
                });
	    }

            if (!$th.data('sort-ignore') &&
		opts.columnData[$th.index()].hide != 'always') {
                $th.unbind('click.horton').bind('click.horton',sortColumn);
	    }
        });

	//
	// If a column was specified to be sorted at table
	// initialization, handle it here.
	//
	$table.find('>thead:first>tr:last-child>th[data-sort-initial],>thead:first>tr:last-child>td[data-sort-initial]').trigger('click.horton').removeAttr('data-sort-initial');

	//
	// Finally, register a handler that gets called when the table
	// rows are modified. This causes the rows to be sorted
	// according to the existing sorted state.
	//
	$table.on('horton.rows.modified',reSort);
    }

    //
    // A function that's called when the table rows are modified.
    //
    function reSort() {
	var $table = $(this),
	opts = $table.data('horton'),
	asc = '>thead:first>tr:last-child>th.'+opts.classes['sorted-ascending']+',>thead:first>tr:last-child>td.'+opts.classes['sorted-ascending'],
	dsc = '>thead:first>tr:last-child>th.'+opts.classes['sorted-descending']+',>thead:first>tr:last-child>td.'+opts.classes['sorted-descending'];
	var $th = $table.find(asc) || $table.find(dsc);

	//
	// No column has been sorted. Simply return.
	//
	if (!$th || $th.index() < 0)
	    return;

	var rows = getRows($table,opts.columnData[$th.index()]);
	if ($th.hasClass(opts.classes['sorted-ascending']))
	    rows.sort(function(a,b){return naturalSort(a.key,b.key);});
	else
	    rows.sort(function(a,b){return naturalSort(b.key,a.key);});
        //
        // Add the rows back to the table.
        //
	var $tbody = $table.find('tbody:first');
        for (var i = 0; i < rows.length; i++) {
	    $tbody.append(rows[i].row);
            if (rows[i].detail)
                $tbody.append(rows[i].detail);
        }
    }

    //
    // A plugin method to programatically sort on a particular column.
    // The 'descending' parameter is optional. Default is ascending.
    // Even allows sorting hidden columns.
    //
    function triggerSort(colname,descending) {
	var $th, $table = $(this),
	opts = $table.data('horton'),
	cd = $.grep(opts.columnData,function(e,i){return e.name == colname;});

	if (descending == undefined)
	    descending = false;

	if (!cd)
	    //
	    // If there is no matching column, simply return.
	    //
	    return;
	cd = cd[0];
	$th = $table.find('>thead:first>tr:last-child>th:eq('+cd.index+'),>thead:first>tr:last-child>td:eq('+cd.index+')');

	$th.trigger('click.horton',[descending]);
    }

    var sortable = {
        name: 'Horton Sortable Plugin',
        version: {major: 0, minor: 1},
        init: hortonSortInit,
	methods: {
	    sort: triggerSort
	}
    };
    var defaults = {
	//
	// Whether sorting should be enabled or not.
	//
	sort: true,
        //
        // A single function for extracting a sort key from a TH/TD
	// element.
        //
        getSortKey: function(cell) {
            return $(cell).data('sort-key') || $(cell).text();
        },
        classes: {
            'sort-indicator': 'horton-sort-indicator',
            'sorted-ascending': 'horton-sorted-ascending',
            'sorted-descending': 'horton-sorted-descending'
        }
    };

    w.horton.plugins.register(w,sortable,defaults);
})(jQuery,window);

/*
 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 * URL: https://github.com/overset/javascript-natural-sort/blob/master/naturalSort.js
 */
function naturalSort (a, b) {
    var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
        sre = /(^[ ]*|[ ]*$)/g,
        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        hre = /^0x[0-9a-f]+$/i,
        ore = /^0/,
        i = function(s) { return naturalSort.insensitive && (''+s).toLowerCase() || ''+s },
        // convert all to strings strip whitespace
        x = i(a).replace(sre, '') || '',
        y = i(b).replace(sre, '') || '',
        // chunk/tokenize
        xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        // numeric, hex or date detection
        xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
        yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
        oFxNcL, oFyNcL;
    // first try and sort Hex codes or Dates
    if (yD)
        if ( xD < yD ) return -1;
        else if ( xD > yD ) return 1;
    // natural sorting through split numeric strings and default strings
    for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
        // find floats not starting with '0', string or 0 if not defined (Clint Priest)
        oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
        oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
        // handle numeric vs string comparison - number < string - (Kyle Adams)
        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
        // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
        else if (typeof oFxNcL !== typeof oFyNcL) {
            oFxNcL += '';
            oFyNcL += '';
        }
        if (oFxNcL < oFyNcL) return -1;
        if (oFxNcL > oFyNcL) return 1;
    }
    return 0;
}

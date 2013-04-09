(function($,w,undefined) {
    if (w.horton == undefined || w.horton == null)
	$.error('Horton: Please make sure horton.js is loaded before this script.');
    function editRowStart(opts,visible,hidden,container) {
	opts.editing = true;
	for (var i = 0; i < visible.length; i++) {
	    for (var j = 0; j < visible[i].elements.length; j++) {
		var $td = $(visible[i].elements[j]),
		ed = $td.data('editor') ||
		    visible[i].columnData.editor ||
		    'text';
		if (!(ed = opts.editors[ed]))
		    ed = opts.editors['text'];
		ed(opts,visible[i].columnData,$td,$td);
		//
		// Set the focus on the first input element of the row.
		//
		if (!(i+j))
		    $td.children('input:first').focus();
	    }
	}
	var $h = $('<div />');
	for (i = 0; i < hidden.length; i++) {
	    $h.append('<span class="horton" style="font-weight:bold;text-decoration:underline">'+hidden[i].columnData.text+"</span><br />");
	    for (j = 0; j < hidden[i].elements.length; j++) {
		var $td = $(hidden[i].elements[j]),
		ed = $td.data('editor') ||
		    hidden[i].columnData.editor ||
		    'text';
		//
		// Create a container with an ID that links it to the
		// cell it came from so when editing ends, the
		// modified value will end up back in the proper
		// hidden cell.
		//
		var $c = $('<span id="cindex-'+$td.index()+'" style="margin-left:10px" />');
		if (!(ed = opts.editors[ed]))
		    ed = opts.editors['text'];
		ed(opts,hidden[i].columnData,$td,$c);
		$h.append($c,'<br />');
	    }
	}
	$(container).append($h);
    }
    function editRowEnd(opts,visible,hidden,container) {
	opts.editing = false;
	for (var i = 0; i < visible.length; i++) {
	    for (var j = 0; j < visible[i].elements.length; j++) {
		var $td = $(visible[i].elements[j]),
		ed = $td.data('editor') ||
		    visible[i].columnData.editor ||
		    'text';
		if (!(ed = opts.editors[ed]))
		    ed = opts.editors['text'];
		ed(opts,visible[i].columnData,$td.children(':first'),$td);
	    }
	}
	//
	// Find the DIV containing all the input fields.
	//
	var $d = $(container).find('div:first');
	for (i = 0; i < hidden.length; i++) {
	    for (j = 0; j < hidden[i].elements.length; j++) {
		var $td = $(hidden[i].elements[j]),
		ed = $td.data('editor')||hidden[i].columnData.editor||'text';
		if (!(ed = opts.editors[ed]))
		    ed = opts.editors['text'];
		ed(opts,hidden[i].columnData,
		   $d.find('#cindex-'+$td.index()).children(':first'),$td);
	    }
	}
    }
    function hortonEditableInit($table,opts) {
        $table.find('> thead > tr:last-child > th,> thead > tr:last-child > td').each(function(){
	    //
	    // Collect the list of cell editors from each column header.
	    //
	    opts.columnData[$(this).index()].editor = $(this).data('editor');
	});
	//
	// Make sure that the click event on any input elements in the
	// rows stops click propagation so the click goes to the input
	// element and not the row.
	//
	$table.find('> tbody:first > tr').on('click.horton','input',
					     function(e){
						 e.stopPropagation();
					     });
    }
    var editable = {
        name: 'Horton Editable Plugin',
        version: {major: 0, minor: 1},
        init: hortonEditableInit,
	methods: {
	}
    };
    var defaults = {
	//
	// Whether the cells are editable or not.
	//
	editable: true,
	//
	// A list of functions that transform cells into editable form
	// and back.
	//
	editors: {
	    'text': function(opts,columnData,$element,$container) {
		if (opts.editing) {
		    $container.html("<input type='text' name=\""+columnData.name+"\" value='"+$element.text()+"'>");
		} else {
		    $container.html($element.val());
		}
	    }
	},
	//
	// Override the default show and hide functions.
	//
	showDetails: editRowStart,
	hideDetails: editRowEnd
    };

    w.horton.plugins.register(w,editable,defaults);
})(jQuery,window);

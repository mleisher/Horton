Horton
======

While looking for *responsive* (element size dynamically adapts to viewport
size) table plugins for jQuery, I came across Chris Coyier's survey
<http://css-tricks.com/responsive-data-table-roundup/>. After looking through
all the approaches presented, the one that seemed the simplest and most
effective was FooTable. After playing around with it for a while, I decided to
tweak the core of FooTable a bit for my own uses and as happens so often with
these things, it got a little out of hand and Horton was born.

_**Horton**_ is a jQuery plugin for HTML tables, heavily influenced by
FooTable <http://themergency.com/footable/>, but takes a slightly different
direction.

##The general problem

When the width of a table changes due to viewport size changes, two things are
needed:

1. Criteria to decide which columns appear/disappear and in which order.

2. Some way of viewing the hidden columns.

##What Horton provides

1. Horton provides a minor variation of the FooTable element notation system
(using `data-*` element attributes) to solve the problem of specifying which
columns should be hidden and when.

2. Horton also provides the same mechanism as FooTable to display columns that
have been hidden.

3. Horton provides programatic access to its functionality through *requests*. 

4. A slightly modified and extended FooTable plugin approach has also been
incorporated, making easy to add plugins to Horton.

The heart of the FooTable notation approach is the idea of
*breakpoints*. These are named widths that set a threshold. Once the width is
below a breakpoint, specified columns get hidden.

Clicking on a row will display the **details** (the hidden columns) in a row
below the one clicked. The default display function will format them into a
single column with column names and the value(s) indented a bit below them.

##Demo

Much of the functionality of Horton can be seen in the demo located at
http://www.math.nmsu.edu/~mleisher/Software/javascript/Horton/.

###Core Attributes

All of these attributes occur in the `<TH>` elements inside a `<THEAD>` of an
HTML table.

<table rules='all' frame='border'>
  <thead>
    <tr>
      <th>Attribute Name</th><th>Type</th><th>Context<th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data-expander</td>
      <td>boolean</td>
      <td>&lt;TH&gt;</td>
      <td>
        When a row has some columns hidden, the &lt;TH&gt; element that has
        this attribute is used to show the image that indicates whether
        the hidden elements are being shown on the next row or not. It does
        not have to be the first element of the row.
      </td>
    </tr>
    <tr>
      <td>data-hide</td>
      <td>string</td>
      <td>&lt;TH&gt;</td>
      <td>
        This attribute takes a comma separated list of breakpoint names. For
        example <code>data-hide='phone,tablet'</code>. Both of these names
        represent widths. If the viewport width is less than or equal to any
        of the named widths in this list, the column is hidden.<br />  This
        attribute has one special value, <code>always</code>, which forces a
        column to be permanently hidden
        (i.e. <code>data-hide='always'</code>).
      </td>
    </tr>
    <tr>
      <td>data-name</td>
      <td>string</td>
      <td>&lt;TH&gt;</td>
      <td>
        This overrides the default column name. The default column name is the
        text of the &lt;TH&gt; element.
      </td>
    </tr>
  </tbody>
</table>

###Trivial table example

```html
<html>
  <head>
    <script type='text/javascript'>
      $(document).ready(function(){
          //
          // Add a breakpoint named 'lcd' at initialization. Any time the
          // viewport gets smaller than or equal to 'lcd' (150 pixels), then
          // hide the columns marked to be hidden when 'lcd' width has been
          // reached. Also pretend that the viewport width is 150 pixels for
          // testing purposes.
          //
          $('table.responsive').horton({
              'breakpoints': {'lcd': 150},
              'testBreakpoint': 'lcd'
          });
      });
    </script>
  </head>
  <body>
    <table class='responsive' id='demo' rules='all' frame='border'>
      <thead>
        <tr>
          <th data-expander='true'>
            Last Name
          </th>
          <th>
            First Name
          </th>
          <th data-hide='phone,lcd'>
            Address
          </th>
          <th colspan='2' data-hide='phone'>
            Contact
          </th>
          <th data-hide='phone,lcd' data-name='On Sabbatical'>
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Bruening</td>
          <td>Karen</td>
          <td>123 Main</td>
          <td>karen@breuning.com</td>
          <td>111-222-3333</td>
          <td>No</td>
        </tr>
        <tr>
          <td>Cambareri</td>
          <td>Alice</td>
          <td>456 Lowen St</td>
          <td>alice@cambareri.com</td>
          <td>444-555-6666</td>
          <td>Yes</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
```

####Explanation of trivial table

The Javascript code in the <code>&lt;script /&gt;</code> tag above,
initializes all tables with class *responsive* with new breakpoint (lcd) and
requests that Horton assume that the viewport size is 'lcd' (150 pixels) for
testing purposes.

The <code>data-expander</code> attribute on the *Last Name* header indicates
that it will be the one showing the (default plus or minus) image indicating
whether there are hidden columns to show or not.

The <code>data-hide</code> attributes tell Horton when to hide those columns.

The <code>data-name</code> attribute changes the name of the column. This name
change is used when the row is clicked to show the hidden columns.

###Initialization

To initialize tables:

```javascript
$(document).ready(function(){
  //
  // Find all tables with class 'responsive' and initialize them
  // with Horton.
  //
  $('table.responsive').horton(options);
});
```

###Core Options

These are all the default options that can be set at any time during the life
of the table. That means, for example, that you could have a button that
changes the test breakpoint dynamically.

<table rules='all' frame='border'>
  <thead>
    <tr>
      <th>
        Name
      </th>
      <th>
        Value
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        breakpoints
      </td>
      <td>
        {'phone': 480,<br />'tablet': 1024}
      </td>
      <td>
        This is an object that maps a width name to a width value in
        pixels. When the viewport width drops below one of these, columns
        marked to be hidden with that name, will be hidden.
      </td>
    </tr>
    <tr>
      <td>
        testBreakpoint
      </td>
      <td>
        null
      </td>
      <td>
        This should be <code>null</code> or one of the breakpoint names. It
        causes Horton to behave as though the viewport is the size of the
        breakpoint name provided.
      </td>
    </tr>
    <tr>
      <td>
        showDetails
      </td>
      <td>
        default function
      </td>
      <td>
        This is the function called to show hidden columns in a row added
        beneath the row clicked.
        <p />
        <code>function showDetails(options,visible,hidden,container)</code>
        <br />
        <span style='margin-left: 10px'>
        <code>options</code> are the current table options.<br />
        <code>visible</code> an array of visible cells.<br />
        <code>hidden</code> an array of hidden cells.<br />
        <code>container</code> the single &lt;TD&gt; element in the row below
  the one clicked.
        </span>
      </td>
    </tr>
    <tr>
      <td>
        hideDetails
      </td>
      <td>
        null
      </td>
      <td>
        This is the function called to hide the row containing the hidden
        columns.
        <p />
        Has the same parameters as <code>showDetails</code>.
      </td>
    </tr>
    <tr>
      <td>
        classes
      </td>
      <td>
        {'collapsed': 'horton-collapsed',<br />'expanded': 'horton-expanded'}
      </td>
      <td>
        These are the two classes that indicate whether a row is showing the
        hidden details or not. See horton.css.
      </td>
    </tr>
  </tbody>
</table>

###Core Requests

Since it is very useful to be able to make changes to and get information from
tables initialized with Horton, there are several requests that can be passed
to one of these tables.

* version

  This request returns an array of version objects, the first one is from the
  Horton core and the others are the plugin versions.

```javascript
          var v = $('table.responsive').horton('version');
          for (var i = 0; i < v.length; i++) {
             if (i == 0) console.log('Horton Version');
             console.log(v[i].name, v[i].version.major+"."+v[i].version.minor);
             if (i == 0 && v.length > 1) console.log('Plugin Versions');
          }
```

* options

  This request returns the options currently in use by the first table found
  by the selector. WARNING: This may change later to return all the options
  objects from the tables selected.

```javascript
          var opts = $('table.responsive').horton('options');
          $.each(opts.breakpoints,function(k,v){
            console.log(k,opts.breakpoints[k]);
          });
```

* numRows

  This returns the number of rows in the table minus the *details* rows (rows
  showing hidden columns). The number of data rows is more useful than keeping
  track of rows added to display hidden columns.

* insertRows

  This request inserts rows *__before__* a specific location in the table. To
  append to a table, provide an insertion point larger than or equal to the
  number of rows in the table. If the sorting plugin is loaded, the table will
  re-sort after the new rows have been inserted.

  The insertion location should be chosen as though no *details* rows (rows
  showing hidden column data) have been added. Horton does not expect you to
  keep track of the number of *details* rows that have been opened.

```javascript
          var rows = '<tr><td>Solomon</td><td>Landa</td><td>789 1st St</td><td>landa@solomon.com</td><td>777-888-9999</td><td>No</td></tr>";
          $('table.responsive').horton('insertRows',2,rows);
```

* replaceRows

  This request replaces the rows between a start point, and __*up to but not
  including*__ the end point in the table; the same meaning as the range
  expected by the <code>.slice()</code> function. If only a new set of rows is
  provided, all existing rows are replaced with the new rows. Only providing
  one value is the same as an *insertRow* request.

  The replacement range should be chosen as though no *details* rows (rows
  showing hidden column data) have been added. Horton does not expect you to
  keep track of the number of *details* rows that have been opened.

```javascript
          var newRow = '<tr><td>Solomon</td><td>Landa</td><td>789 1st St</td><td>landa@solomon.com</td><td>777-888-9999</td><td>No</td></tr>";
          //
          // Replace all rows in the table with newRow.
          //
          $('table.responsive').horton('replaceRows',newRow);

          //
          // Insert newRow before row 5 in the table.
          //
          $('table.responsive').horton('replaceRows',5,newRow);

          //
          // Replace rows 5, 6, and 7 with newRow.
          //
          $('table.responsive').horton('replaceRows',5,8,newRow);
```

###Core Events

The core of Horton only triggers one custom event at the moment:
<code>horton.rows.modified</code> whenever rows are changed with requests
<code>insertRows</code> and <code>replaceRows</code>. No data is passed to the
event handler.

The sorting plugin uses this event to re-sort the table after the rows have
changed.

##Plugins

###Horton Sortable Plugin

  This plugin provides column sorting with the ability to make columns sort
  together in a particular order. For example, when you sort by a last name,
  it is nice if the associated first names were sorted as well.

  The sort key comparison is done with Jim Palmer's Natural Sort Javascript
  routine
  (https://github.com/overset/javascript-natural-sort/blob/master/naturalSort.js). This
  means no special handling of numbers versus strings is needed to get things
  to sort "naturally."

####Sorting Attributes

<table rules='all' frame='border'>
  <thead>
    <tr>
      <th>Attribute Name</th><th>Type</th><th>Context<th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data-sort-ignore</td>
      <td>boolean</td>
      <td>&lt;TH&gt;</td>
      <td>
        This tells the sorting plugin to ignore this column while sorting.
      </td>
    </tr>
    <tr>
      <td>data-sort-key</td>
      <td>string</td>
      <td>
        &lt;TH&gt;<br />&lt;TD&gt;
      </td>
      <td>
        If a &lt;TH&gt; element has a colspan > 1, then this attribute informs
        the sorting plugin which table body columns it should use to create a
        sort key and in what order. For example, <code>&lt;th colspan='3'
        data-sort-key='1,0'&gt;Header&lt;/th&gt;</code> tells the sorting
        plugin that this header spans 3 columns in the table body, but to use
        body columns 1 and then 0 to sort this column, ignoring column 2.
        <p />
        In the table body, the default sort key of a cell is the text contents
        of the cell. This overrides that sort key with something more
        appropriate. For example, <code>&lt;td
        data-sort-key='1365526937'&gt;9 April 2013&lt;/td&gt;</code> will sort
        by the value in <code>data-sort-key</code> rather than the
        string <code>9 April 2013</code>.
      </td>
    </tr>
    <tr>
      <td>data-sort-with</td>
      <td>string</td>
      <td>
        &lt;TH&gt;
      </td>
      <td>
        This attribute tells the sorting plugin that this column should be
        sorted with one or more other columns. For example, <code>&ltth
        data-sort-with='First Name,Address'&gt;Last Name&lt;/th&gt;</code>
        will cause the <code>Last Name</code> column to be sorted first,
        followed by the <code>First Name</code> column, and then
        the <code>Address</code> column.
      </td>
    </tr>
  </tbody>
</table>

####Sorting Options

<table rules='all' frame='border'>
  <thead>
    <tr>
      <th>
        Name
      </th>
      <th>
        Value
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        sort
      </td>
      <td>
        true
      </td>
      <td>
        This indicates whether sorting is enabled or not. As of version 0.1,
        there is no way to dynamically disable sorting. That feature will
        be available soon.
      </td>
    </tr>
    <tr>
      <td>
        getSortKey
      </td>
      <td>
        default function to get sort key from cell
      </td>
      <td>
        This is the function responsible for turning the cell contents into
        something that can be sorted. The default function returns either the
        value of the <code>data-sort-key</code> attribute, or the textual
        contents of the cell.
      </td>
    </tr>
    <tr>
      <td>
        classes
      </td>
      <td>
        {'sort-indicator': 'horton-sort-indicator',<br />
        'sorted-ascending': 'horton-sorted-ascending',<br />
        'sorted-descending': 'horton-sorted-descending'}
      </td>
      <td>
        This is an object that maps class names to actual class names to
        provide CSS information about sort indicators.
      </td>
    </tr>
  </tbody>
</table>


####Sorting Requests

The sorting plugin only provides one request.

* sort

  This request can be used to programatically sort columns in ascending or
  descending order, obeying the <code>data-sort-*</code> attributes applied to
  the table cells.

```javascript
          //
          // Tell the sorting plugin to sort by the Address column in
          // descending order.
          //
          $('table.responsive').horton('sort','Address',true);

          //
          // Tell the sorting plugin to sort by the First Name column in
          // ascending order.
          //
          $('table.responsive').horton('sort','First Name',false);
```

####Sorting Events

This plugin only triggers one custom event at the moment,
<code>horton.sorted</code>, triggered after sorting is done by clicking on a
header and passing the header name and whether the sort was descending or
not.

```javascript
           $('table.responsive').on('horton.sorted',
                      function(event,columnName,descending){
                      });
```

###Horton Editable Plugin

This plugin exists primarily to demonstrate how to write a plugin. It isn't
very sophisticated, but should be guidance enough to implement plugins and
custom editors. It implements editing the table cells in place, visible and
hidden.

This doesn't really need to be a plugin, the <code>showDetails</code>
and <code>hideDetails</code> functions of the Horton core can be replaced at
initialization time.

####Editing Attributes

<table rules='all' frame='border'>
  <thead>
    <tr>
      <th>Attribute Name</th><th>Type</th><th>Context<th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data-editor</td>
      <td>string</td>
      <td>&lt;TH&gt;<br />&lt;TD&gt;</td>
      <td>
        When applied to a &lt;TH&gt; element in the table header, this names
        the editor to use for all cells in this column.
        <p />
        When applied to a &lt;TD&gt; element in the table body, this overrides
        whatever editor was specified in the table header for this column.
      </td>
    </tr>
  </tbody>
</table>

####Editing Options

<table rules='all' frame='border'>
  <thead>
    <tr>
      <th>
        Name
      </th>
      <th>
        Value
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>editable</td>
      <td>true</td>
      <td>
        This indicates whether the editable plugin is active or not. As of
        version 0.1, this option doesn't effect anything.
      </td>
    </tr>
    <tr>
      <td>editors</td>
      <td>{'text': default text edit function}</td>
      <td>
        This is an object that maps editor names to functions. Some cells need a
        more sophisticated editor than a simple text field.
      </td>
    </tr>
  </tbody>
</table>

####Editing Requests

None.

####Editing Options

None.

##Contributors

**Author:** Mark Leisher <mleisher@gmail.com>

##Thanks

I would like to thank Steve Usher and Brad Vicent for their great work on
FooTable, without which I never would have wasted several weeks creating
Horton.

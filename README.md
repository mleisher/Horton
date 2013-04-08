Horton
======

While looking for *responsive* (element size dynamically adapts to viewport
size) table plugins for jQuery, I came across Chris Coyier's survey
<http://css-tricks.com/responsive-data-table-roundup/>. After looking through
all the approaches presented, the one that seemed the simplest and most
effective was FooTable. After contributing one minor enhancement (multi-column
sorting), I decided to tweak the core of FooTable a bit for my own uses and as
happens so often with these things, it got a little out of hand and Horton was
born.

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

Clicking on a row will display the hidden columns in a row below the one
clicked. The default display function will format them into a single column
with column names and the value(s) indented a bit below them.

##Basic element notation.

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

##Trivial table example

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

###Explanation of trivial table

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

##Initialization

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

##Default options

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
        {'phone': 480, 'tablet': 1024}
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
      </td>
    </tr>
    <tr>
      <td>
        classes
      </td>
      <td>
        {'collapsed': 'horton-collapsed', 'expanded': 'horton-expanded'}
      </td>
      <td>
        These are the two classes that indicate whether a row is showing the
        hidden details or not. See horton.css.
      </td>
    </tr>
  </tbody>
</table>


**Author:** Mark Leisher <mleisher@gmail.com>

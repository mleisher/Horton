Horton
======

_**Horton**_ is a jQuery plugin for HTML tables heavily influenced by FooTable
<http://themergency.com/footable/> that takes a slightly different direction
that better suits my needs at the moment.

While looking for *responsive* (element size dynamically adapts to viewport
size) table plugins for jQuery, I came across Chris Coyier's survey
<http://css-tricks.com/responsive-data-table-roundup/>. After looking through
all the approaches presented, the one that seemed the simplest and most
effective was FooTable. After contributing one minor enhancement (multi-column
sorting), I decided to tweak the core of FooTable a bit for my own uses and as
happens so often with these things, it got a little out of hand and Horton was
born.

##The general problem.

When the width of a table changes due to viewport size changes, two things are
needed:

1. Criteria to decide which columns appear/disappear and in which order.

2. Some way of viewing the hidden columns.

##What Horton provides.

1. Horton provides a minor variation of the FooTable element notation system
(using `data-*` element attributes) to solve the problem of specifying which
columns should be hidden and when.

2. Horton also provides the same mechanism as FooTable to display columns that
have been hidden.

3. A slightly modified and extended FooTable plugin approach has also been
incorporated, making easy to add plugins to Horton.

The heart of the FooTable notation approach is the idea of
*breakpoints*. These are named widths that set a threshold. Once the width is
below a breakpoint, specified columns get hidden.

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
        of the named widths in this list, the column is hidden.
      </td>
    </tr>
    <tr>
      <td>data-name='...'</td>
      <td>string</td>
      <td>&lt;TH&gt;</td>
      <td>
        This overrides the default column name. The default column name is the
        text of the &lt;TH&gt; element.
      </td>
    </tr>
  </tbody>
</table>

**Author:** Mark Leisher <mleisher@gmail.com>

# jQuery.spHtmlEditor
**SharePoint Rich Text Editor jQuery Plugin**

Matthew Stark / Making Things Work 

Loads the SharePoint RTE onto a page using JavaScript.  Plugin works on both Office 365 and On-Premises versions of SharePoint.

Tested on: 
- Office 365 
- SharePoint 2013, SharePoint 2016
- jQuery 2.1.4

##Loading Plugin:

1) Reference jQuery and the jQuery.spHtmlEditor JavaScript files:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js" ></script>

<script src="/SiteAssets/jQuery.spHtmlEditor.js" ></script>;
```

2) Insert HTML Element to host the RTE content:

```html
<div id="rteeditor"><p>RTE Content</p></div>
```

3) Load the Rich Text Area after page has loaded (ensure init.js & SP.js are referenced on the page):

```javascript
(function($) {
   ExecuteOrDelayUntilScriptLoaded(function(){
      $(function() {
        $("#rteeditor").spHtmlEditor();
      });
   },'sp.js');
})(jQuery);

```


##Supported options:

**noContentHtml**:  The HTML to be displayed if there is no content in the RTE.  Default: "&lt;span&gt;Click here to Edit&lt;/span&gt;"

**callback**: Method that is called when the form is submitted.  Default empty method.

**className**: Class name to append to the editor container.  Default empty string.

**version**: o365/onprem - text value indicating platform target "o365" or "onprem".  Default "o365".

**method**: add/remove/sethtml/gethtml - indicates the method to execute.  Default "add".  See more below

**prefixStylesheet**: The CSS prefix for styles to be included in the ribbon.  Default null which renders "ms-rte" styles.  

**prefixStylesheetUrl**:  Path to custom CSS file containing branding styles to be included in the ribbon.  Must contain prefixStylesheet classes.  Default: null;

##Supported Methods:

**add**: Initialize the spHtmlEditor within rteeditor HTML element.

```javascript
$("#rteeditor").spHtmlEditor({
  version: "onprem",
  callback: function (html, id, webPart, webPartId) { alert("Processing"); },
  className: "my-js-rte",
  prefixStylesheet: "my-rte",
  prefixStylesheetUrl: "\u002fStyle Library\u002f<my-rte-customstylesheet>.css"
});
```

**remove**: Remove the spHtmlEditor from the HTML element (this will execute the callback function).

```javascript
$("#rteeditor").spHtmlEditor({method: "remove"});
```

**sethtml**: Set the HTML within the spHtmlEditor:

```javascript
$("#rteeditor").spHtmlEditor({method: "sethtml", html: "<p>New HTML Content</p>"});
```

**gethtml**: retrieve HTML from the first spHtmlEditor in selector.
```javascript

$("#rteeditor").spHtmlEditor({method: "gethtml"});
//or use shorthand
$("#rteeditor").spHtmlEditor("gethtml");

```

##Further Reading
Initial Release: http://makingthings.work/sharepoint-rte-jquery-plugin/



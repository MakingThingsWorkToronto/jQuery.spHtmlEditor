(function ($, document, window, undefined) {

    $.fn.spHtmlEditor = function (opts) {

        if (opts && (opts == "gethtml" || opts.method == "gethtml")) {

            var editId = $(".edit-content", this).attr("id");
            RTE.RichTextEditor.transferContentsToInputField(editId);
            return $("input[type='hidden']", this).val();

        }

        var $opts = $.extend($.fn.spHtmlEditor.defaults, opts);

        return $(this).each(function () {

            return (function (me, $opts) {

                $.fn.spHtmlEditor.load[$opts.version](function () {

                    fixRibbonLoader();

                    if ($opts.method == "add") {

                        var oldMarkup = $(me).html(),
		                    id = $(me).html("").attr("id");

                        if (typeof (id) != 'string') {

                            id = "rte-client-" + $.fn.spHtmlEditor.idCnt;
                            $(me).attr("id", id);
                            $.fn.spHtmlEditor.idCnt++;

                        }

                        var newEditor = $($opts.template).appendTo(me).addClass($opts.className),
		                    eid = id + "_editor",
		                    cid = id + "_content",
		                    ncid = id + "_nocontent",

		                    hiddenTxt = $("input[type='hidden']", newEditor)
		                                    .attr("id", cid)
		                                    .val(oldMarkup),

		                    noContent = $(".no-content", newEditor)
		                                    .attr("id", ncid)
		                                    .attr("name", ncid)
		                                    .html($opts.noContentHtml),

		                    edit = $(".edit-content", newEditor)
		                                .attr("id", eid)
		                                .attr("InputFieldId", cid)
		                                .attr("EmptyPanelId", ncid)
		                                .attr("AllowScripts", "true")
		                                .html(oldMarkup);

                        newEditor.attr("RteRedirect", eid);

                        if ($opts.prefixStylesheet && $opts.prefixStylesheetUrl) {
                            edit[0]['PrefixStyleSheet'] = $opts.prefixStylesheet;
                            edit[0]['StyleSheet'] = $opts.prefixStylesheetUrl;
                        }

                        RTE.Canvas.fixRegion(eid, false);

                        if (!oldMarkup || oldMarkup == "") edit.hide();
                        else noContent.hide();

                        edit.html(oldMarkup);

                        (function (id, hidden, callback) {

                            $("form").submit(function () {

                                RTE.RichTextEditor.transferContentsToInputField(id);
                                var html = hidden.html(),
		                            wp = $("#" + id);

                                while (!wp.hasClass("ms-WPBody")) {
                                    wp = wp.parent();
                                    if (wp.length == 0) break;
                                }

                                callback(html, id, wp, wp.attr("id"));

                            });

                        })(eid, hiddenTxt, $opts.callback);

                    } else if ($opts.method == "sethtml" && $opts.html) {

                        var ec = $(".edit-content", me),
							editId = ec.attr("id");

                        ec.html($opts.html);

                        RTE.RichTextEditor.transferContentsToInputField(editId);

                    } else if ($opts.method == "remove") {

                        var editId = $(".edit-content", me).attr("id");
                        RTE.RichTextEditor.transferContentsToInputField(editId);
                        var newHtml = $("input[type='hidden']", me).val();
                        $(me).html(newHtml);

                    }

                });

            })(this, $opts);

        });

    };

    $.fn.spHtmlEditor.idCnt = 0;

    $.fn.spHtmlEditor.defaults = {
        noContentHtml: "<span>Click here to Edit</span>",
        template: "<div><div class='DCContentBlock'><div class='DCContent'> " +
	                    "<div class='edit-content ms-rtestate-write ms-rtestate-field goo-edit-part' contentEditable='true'></div>" +
	                    "<div class='no-content'></div>" +
	                "</div></div>" +
	                "<input type='hidden' /></div>",
        callback: function (html, id, webPart, webPartId) { },
        className: "",
        version: "o365",
        method: "add",
        prefixStylesheet: null,
        prefixStylesheetUrl: null
    };

    $.fn.spHtmlEditor.load = {
        o365: load_o365,
        onprem: load_onprem
    };

    function load_o365(ready, path) {
        var p = path || o365layouts(["init.js"]);
        load_onprem(ready, p);
    }

	function o365layouts(a){
		if(a && $.isArray(a)) {
			var dir = "";
			$.each(a, function(i, script) {
				var el = $("script[src*='" + script +"']");
				if(el.length > 0) {
					var src = el.attr("src"),
						pos = src.lastIndexOf("/");
					dir = src.substr(0, pos+1);
					return false;
				}
			});
			return dir;
		}
		return "/_layouts/15/";
	}

    function load_onprem(ready, path) {

        var p = path || "/_layouts/15/",
			spVersion = parseInt(_spPageContextInfo.siteClientTag.match(/\$\$(\d{2})\./i)[1], 10);
			
        if (spVersion >= 16 && (typeof (g_all_modules) == "undefined"
            || typeof (g_all_modules["ms.rte.js"]) == "undefined")
            && $("#msrtejs").length == 0) {
            
            $('<script id="msrtejs" type="text/javascript" src="' + p + 'ms.rte.js">' + '</' + 'script>').appendTo("body");

	        ExecuteOrDelayUntilScriptLoaded(function () {
	        	loadUi();	
	        }, "ms.rte.js");

        } else {
        	loadUi();
        }

		function loadUi(){

			if ((typeof (g_all_modules) == "undefined"
				|| typeof (g_all_modules["sp.ui.rte.js"]) == "undefined")
				&& $("#spuirtejs").length == 0)
	            $('<script id="spuirtejs" type="text/javascript" src="' + p + 'sp.ui.rte.js">' + '</' + 'script>').appendTo("body");
	
	        ExecuteOrDelayUntilScriptLoaded(function () {
	            ready();
	        }, "sp.ui.rte.js");
	        
		}

    }

    function fixRibbonLoader() {

        var func = _ribbonInitFunc1.toString(),
			findStart = /'RibbonContainer',/,
			pos = findStart.exec(func);

        if (func.indexOf("'WSSRTE': true") == -1) {

            var endPos = func.indexOf("}", pos.index),
				startStr = func.substr(0, endPos),
				endStr = func.substr(endPos);

            func = startStr + ", 'Ribbon.Table.Design': true, 'Ribbon.RcaTabGroup.Rca': true, 'Ribbon.Image.Image': true, 'Ribbon.Table.Layout': true, 'Ribbon.WebPartOption': true, 'Ribbon.WebPartInsert.Tab': true, 'Ribbon.EditingTools.CPInsert': true, 'Ribbon.EditingTools.CPEditTab': true, 'Ribbon.Link.Link': true" + endStr;

            func = func.replace("{'PublishTabTrimmingVisibilityContext':true,'WSSPageStateVisibilityContext':true}, false, 0, false", "{'WSSRTE': true,'PublishTabTrimmingVisibilityContext':true,'WSSPageStateVisibilityContext':true}, true, 0, false");
            func = func.replace("'SP.Ribbon.PageManager.get_instance()', false, null, null, null,", "'SP.Ribbon.PageManager.get_instance()', false, { 'Ribbon.EditingTools': true }, null, null,");
            $("<script>" + func + "</" + "script>").appendTo("body");

            _ribbonDataInit('Ribbon.EditingTools', true);
            _ribbonDataInit('Ribbon.EditingTools.CPEditTab', false);

        }

        _ribbonStartInit("Ribbon.Read", false, null);

		SP.SOD.executeOrDelayUntilScriptLoaded(function() {      
		    if (!SP.Ribbon.PageManager.get_instance().get_ribbon())
		        _ribbonStartInit("Ribbon.Read", false, null);
		}, 'sp.ribbon.js');

    }

    function EnsurePublishingConsoleActionScripts() {
        EnsureScripts(
		[['SP.Ribbon.js', 'SP.Ribbon', true],
		['SP.Publishing.Resources.resx', 'SP.Publishing.Resources', false],
		['SP.UI.Pub.Ribbon.js', 'Pub.Ribbon', true]], PublishingRibbonUpdateRibbon);
    }

    if (_spBodyOnLoadFunctionNames != null && !_spBodyOnLoadCalled) {
        _spBodyOnLoadFunctionNames.push('EnsurePublishingConsoleActionScripts');
    } else {
        EnsurePublishingConsoleActionScripts();
    }


})(jQuery, document, window);
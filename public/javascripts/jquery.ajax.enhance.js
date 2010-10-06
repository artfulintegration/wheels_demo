/*!
 * jQuery AJAX Enchance v0.9
 * http://blog.istvan-antal.ro/
 *
 * Copyright 2010, István Miklós Antal
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * see: license/mit.txt or license/gpl-3.0.txt
 *
 */

(function($,window,document,undefined) {
    
    //function that thandles both POST and GET methods
    var sendGeneric = function(method,url,func,dataType) {
        //sort arguments
        if ($.isFunction( url )) {
            dataType = func;
            func = url;
            url = undefined;
        }

        if (func==undefined) {
            func = $.noop;
        }

        //filter out non form elements
        this.filter('form');

        //filter out actioneless elements if URL was not specified
        if (url==undefined) {
            this.filter('[action]');
        }

        //abort if no elements found
        if ( !this.length ) {
            return this;
        }

        

        //execute
        this.each(function() {
            var aurl = url || $(this).attr('action');

            switch (method) {
                case 'post':
                    $.post(aurl, $(this).serialize(), function(data) {
                        func.call(this,data);
                    },dataType);
                    break;
                case 'upload':
                    //check for YUI Connect
                    if (YAHOO && YAHOO.util && YAHOO.util.Connect) {
                        YAHOO.util.Connect.setForm(this, true);
                        YAHOO.util.Connect.asyncRequest('POST', aurl, {
                            upload: function(response) {
                                var data = response.responseText;
                                //Don't really feel that other data types actually make sense here
                                switch (dataType) {
                                    case 'json':
                                        data = $.parseJSON(data);
                                        break;
                                    case 'xml':
                                        data = response.responseXML;
                                        break;
                                    default:
                                        data = response.responseText;
                                }
                                func.call(this,data);
                            }
                        });
                    } else {
                        throw 'Uploading requires YUI Connection Manager';
                    }
                    break;
                default:
                    $.get(aurl, $(this).serialize(), function(data) {
                        func.call(this,data);
                    },dataType);

            }
        });

        //return
        return this;
    }

    //Extend jQuery method space
    $.fn.extend({
        ajaxPost: function(url,func,dataType) {
            sendGeneric.call(this,'post',url,func,dataType);
        },
        ajaxGet: function(url,func,dataType) {
            sendGeneric.call(this,'get',url,func,dataType);
        },
        ajaxUpload: function(url,func,dataType) {
            sendGeneric.call(this,'upload',url,func,dataType);
        }
    });

}(jQuery,window,document));
function array_print(_name, arr) {
  ret = _name + ": {\n";
  for(key in arr) {
    ret += "  " + key.toString() + ":" + (arr[key] ? arr[key].toString() : '') + "\n"
  }
  ret += "}";
  console.log(ret);
  return ret;
}
var editor = null;

function createEditor(){
  if (editor) {destroyEditor();}
}

function destroyEditor(){
  $('.ckeditor_textarea').ckeditor(function(){
    this.destroy();
  })
}

function userDialog(title, msg){
  $("#dialog").dialog("destroy");
  $('#dialog').attr('title', title);
  $('#dialog_html').html(msg);
  setupDialog();
  $('#dialog').dialog('open');
  return false;
}

function setupDialog(){
  $('#dialog').dialog({
    autoOpen: false,
    show: 'blind',
    hide: 'explode'
  });
}

$(function() {
  setupDialog();
});

function ajax(settings) {
  callback = settings['complete']
  settings['complete'] = function(data, textStatus, xhr) {

  }
}

function sortNodes(nodes) {
  nodes.sort(function(a,b){if (a.position==b.position) return 0; else return (a.position<b.position ? -1 : 1) });
  for(i in nodes) sortNodes(nodes[i].children);
  return nodes;
}

function sitemapJsTreeConfig(settings){
  return {
    // the list of plugins to include
    "plugins" : [ "themes", "json_data", "ui", "crrm", "cookies", "dnd", "search", "types", "hotkeys", "contextmenu" ],
    // Plugin configuration

    // I usually configure the plugin that handles the data first - in this case JSON as it is most common
    "json_data" : {
      // I chose an ajax enabled tree - again - as this is most common, and maybe a bit more complex
      // All the options are the same as jQuery's except for `data` which CAN (not should) be a function
      "ajax" : {
        // the URL to fetch the data
        "url" : "/sitemaps.json?" + Date().toString(),
        // this function is executed in the instance's scope (this refers to the tree instance)
        // the parameter is the node being loaded (may be -1, 0, or undefined when loading the root nodes)
        "data" : function (n) {
          // the result is fed to the AJAX request `data` option
          return n.attr ?
            {"parent_id" : n.attr("id").replace("node_","")} :
            {};
        },
        "success" : function (data) { return sortNodes(data); }
      }
    },
    "themes" : {
      "theme" : "default",
    },
    // Using types - most of the time this is an overkill
    // Still meny people use them - here is how
    "types" : {
      // I set both options to -2, as I do not need depth and children count checking
      // Those two checks may slow jstree a lot, so use only when needed
      "max_depth" : -2,
      "max_children" : -2,
      // I want only `drive` nodes to be root nodes
      // This will prevent moving or creating any other type as a root node
      "valid_children" : [ "menu" ],
      "types" : {
        // The default type
        "page" : {
          // I want this type to have no children (so only leaf nodes)
          // In my case - those are files
          "valid_children" : ["page", "external_link", "gallery"],
          // If we specify an icon for the default type it WILL OVERRIDE the theme icons
          "icon" : {
            "image" : "/jstree/icons/web_page.png"
          }
        },
        // The `folder` type
        "external_link" : {
          // can have files and other folders inside of it, but NOT `drive` nodes
          "valid_children" : "none",
          "icon" : {
            "image" : "/jstree/icons/hyperlink.png"
          }
        },
        "gallery" : {
          // can have files and other folders inside of it, but NOT `drive` nodes
          "valid_children" : "none",
          "icon" : {
            "image" : "/jstree/icons/gallery.png"
          }
        },
        "app_config" : {
          // can have files and other folders inside of it, but NOT `drive` nodes
          "valid_children" : "app_config",
          "icon" : {
            "image" : "/jstree/icons/configuration-icon.png"
          }
        },
        "menu" : {
          // can have files and folders inside, but NOT other `drive` nodes
          "valid_children" : [ "page", "external_link", "gallery", "app_config" ],
          "icon" : {
            "image" : "/jstree/icons/menu.png"
          },
          // those options prevent the functions with the same name to be used on the `drive` type nodes
          // internally the `before` event is used
          "start_drag" : false,
          "move_node" : false,
          "delete_node" : false,
          "remove" : false
        }
      }
    },

    "contextmenu" : {
      items : contextMenuItems
    },
    // For UI & core - the nodes to initially select and open will be overwritten by the cookie plugin

    // the UI plugin - it handles selecting/deselecting/hovering nodes
    "ui" : {
      "initially_select" : [ "node_1" ]
    },
    // the core plugin - not many options here
    "core" : {
      // just open those two nodes up
      // as this is an AJAX enabled tree, both will be downloaded from the server
      // "initially_open" : [ "node_2" , "node_3" ]
    }
  }
}
function jstreeEventDeclarations(){
  if (!__eventDeclarations) {
    var __eventDeclarations = {
      "create.jstree" : function (e, data) {
        createSiteMap({
          'menu_text' : data.rslt.name,
          'position' : data.rslt.position,
          'resource_type' : data.rslt.obj.attr("data_resource_type"),
          'resource_id' : data.rslt.obj.attr("data_resource_id"),
          'parent_id' : data.rslt.parent.attr("id").replace("node_",""),
        },
        ///////////////////////////////////////////////////////////////////
        // data object:
        //   - args: the arguments passed to create_node
        //   - inst: the jstree instance
        //   - rslt: { obj:[object Object] name:Crap parent:[object Object] position:4 }
        // r: the JSON object returned by the server.
        //#################################################################
        function (r) {
          if(r.status) {
            $node = $(data.rslt.obj);
            $node.attr("id", "node_" + r.id);
            $node.attr("data_menu_text", data.rslt.name);
            $node.attr("data_id", r.id);
            $node.attr("data_resource_type", r.resource_type);
            $node.attr("data_resource_id", r.resource_id);
          }
          else {
            $.jstree.rollback(data.rlbk);
          }
        });
      },

      "remove.jstree" : function (e, data) {
        data.rslt.obj.each(function () {
          deleteSiteMap(this.id.replace("node_",""),
            function (r) {
              if(!r.status) {
                data.inst.refresh();
              }
            }
          );
        });
      },
      "select_node.jstree" : function (e, data) {
        $node = data.rslt.obj;
        resource_type = $node.attr('data_resource_type');
        if (resource_type=='Page') {controller= '/pages/'}
        else if (resource_type=='ExternalLink') {controller= '/external_links/'}
        else if (resource_type=='Menu') {controller = '/menus/'}
        $.ajax({
          url : controller + $node.attr('data_resource_id') + ".js",
          data: {container: 'content_pane', ajax_function: 'html'},
          dataType : "script"
        });
      },
      "rename.jstree" : function (e, data) {
        array_print('data.rslt', data.rslt);
        array_print('data.args', data.args);

        updateSiteMap(
          {
            'id' : $(data.rslt.obj).attr("data_id"),
            'menu_text' : data.rslt.new_name,
          },
          function (r) {
            if(!r.status) {
              $(data.rslt.obj).attr("data_menu_text", data.rslt.new_name);
              $.jstree.rollback(data.rlbk);
            }
          }
        );
      },
      "move_node.jstree" : function (e, data) {
        data.rslt.o.each(function (i, node) {
          $node = $(node);
          if (data.rslt.cy) {
            newPosition = data.rslt.cp + i;
            //if (newPosition==null) newPosition = 0;
            createSiteMap(
              {
                'parent_id' : data.rslt.np.attr("id").replace("node_",""),
                'position'  : newPosition,
                'menu_text' : $node.attr("data_menu_text"),
                'resource_type' : $node.attr("data_resource_type"),
                'resource_id' : $node.attr("data_resource_id"),
              },
              moveNodeCallback(data)
            );
          } else {
            updateSiteMap(
              {
                'id' : $(this).attr("id").replace("node_",""),
                'parent_id' : data.rslt.np.attr("id").replace("node_",""),
                'position'  : (data.rslt.cp ? data.rslt.cp : 0) + i
              },
              moveNodeCallback(data)
            );
          }
        });
      }
    }  //  Close the data array.
    return __eventDeclarations;
  }
}

function moveNodeCallback(data){
  return function(r) {
    if(!r.status) {
      $.jstree.rollback(data.rlbk);
    }
    else {
      $node = $(data.rslt.oc);
      $node.attr("id", "node_" + r.id);
      $node.attr("data_menu_text", data.rslt.name);
      $node.attr("data_id", r.id);
      $node.attr("data_resource_type", r.resource_type);
      $node.attr("data_resource_id", r.resource_id);
      if(data.rslt.cy && $(data.rslt.oc).children("UL").length) {
        data.inst.refresh(data.inst._get_parent(data.rslt.oc));
      }
    }
  };
}


function contextMenuItems($node){
  rc = $node.attr('data_resource_type')
  if (rc=="ExternalLink") {
    return {"edit_link" : __cm_edit_link(),
            "remove" : __cm_remove(),
            "ccp" : __cm_ccp()};
  } else if (rc=="Menu") {
    if ($node.attr('data_menu_text')=='Settings')
      return {"new_app_config" : __cm_new_app_config()};
    else
      return {"new_page" : __cm_new_page(),
              "new_link" : __cm_new_link()};
  } else if (rc=="AppConfig") {
    return {
      "edit_config" : __cm_edit("Edit", '/app_configs')
    }
  } else if (rc=="Page") {
    return {"new_page" : __cm_new_page(),
            "new_link" : __cm_new_link(),
            "edit_page": __cm_edit_page(),
            "access_control": __cm_edit_page_acl(),
          "cut" : {
            "separator_before"  : false,
            "separator_after"  : false,
            "label"        : "Cut",
            "action"      : function (obj) { this.cut(obj); }
          },
          "copy" : {
            "separator_before"  : false,
            "icon"        : false,
            "separator_after"  : false,
            "label"        : "Copy",
            "action"      : function (obj) { this.copy(obj); }
          },
          "paste" : {
            "separator_before"  : false,
            "icon"        : false,
            "separator_after"  : false,
            "label"        : "Paste",
            "action"      : function (obj) { this.paste(obj); }
          },
            "ccp" : __cm_ccp()};
  }
}

function __cm_new_page(){
  return {
        "separator_before"  : false,
        "separator_after"  : true,
        "label"        : "New Page",
        "action"      : function (obj) {
            this.create(obj, "last", {
                "attr" : {
                  "data_resource_type" : "Page",
                  "rel" : "page"
                }
            });
        }
      };
}

function __cm_new_app_config() {
  return {
        "separator_before"  : false,
        "separator_after"  : true,
        "label"        : "New App Setting",
        "action"      : function (obj) {
            this.create(obj, "last", {
                "attr" : {
                  "data_resource_type" : "AppConfig",
                  "rel" : "app_config"
                }
            });
        }
      };

}

function __cm_new_link(){
  return {
        "separator_before"  : false,
        "separator_after"  : true,
        "label"        : "New Link",
        "action"      : function (obj) {
            this.create(obj, "last", {
                "attr" : {
                  "data_resource_type" : "ExternalLink",
                  "rel" : "external_link"
                }
            });
        }
      };
}

function __cm_rename(){
  return {
        "separator_before"  : false,
        "separator_after"  : false,
        "label"        : "Rename",
        "action"      : function (obj) { this.rename(obj); }
      };
}

function __cm_remove(){
  return {
        "separator_before"  : false,
        "icon"        : false,
        "separator_after"  : false,
        "label"        : "Delete",
        "action"      : function (obj) { this.remove(obj); }
      };
}

function __cm_edit_link(){
  return {
        "separator_before"  : false,
        "icon"        : false,
        "separator_after"  : false,
        "label"        : "Edit Link",
        "action"      : function (obj) {
          $.ajax({
            url : "/external_links/" + obj.attr('data_resource_id') + "/edit.js",
            data: {container: 'content_pane', ajax_function: 'html'},
            dataType : "script"
          });
        }
  };
}

function __cm_edit_page(){
  return __cm_edit("Edit Page", "/pages");
}

function __cm_edit(label, path){
  return {
        "separator_before"  : false,
        "icon"        : false,
        "separator_after"  : false,
        "label"        : label,
        "action"      : function (obj) {
          path = path + "/" + obj.attr('data_resource_id') + "/edit.js";
          $.ajax({
            url : path,
            data: {container: 'content_pane', ajax_function: 'html'},
            dataType : "script"
          });
        }
  };

}

function __cm_edit_page_acl(){
  return {
        "separator_before"  : false,
        "icon"              : false,
        "separator_after"   : false,
        "label"             : "Access Control",
        "action"            : function (obj) {
          $.ajax({
            url : "/access_control_entries.js",
            data: {
              container     : 'content_pane',
              ajax_function : 'html',
              page_id       : obj.attr('data_resource_id')
              },
            dataType : "script"
          });
        }
  };
}



function __cm_ccp(){
  return {
        "separator_before"  : true,
        "icon"        : false,
        "separator_after"  : false,
        "label"        : "Edit",
        "action"      : false,
        "submenu" : {
          "cut" : {
            "separator_before"  : false,
            "separator_after"  : false,
            "label"        : "Cut",
            "action"      : function (obj) { this.cut(obj); }
          },
          "copy" : {
            "separator_before"  : false,
            "icon"        : false,
            "separator_after"  : false,
            "label"        : "Copy",
            "action"      : function (obj) { this.copy(obj); }
          },
          "paste" : {
            "separator_before"  : false,
            "icon"        : false,
            "separator_after"  : false,
            "label"        : "Paste",
            "action"      : function (obj) { this.paste(obj); }
          }
        }
      };
}


function custom_alert(output_msg, title_msg) {
  if (!title_msg)
    title_msg = 'Alert';

  if (!output_msg)
    output_msg = 'No Message to Display.';

  $("<div></div>").html(output_msg).dialog({
    title : title_msg,
    resizable : false,
    modal : true,
    buttons : {
      "Ok" : function() {
        $(this).dialog("close");
      }
    }
  });
}

function handleThingDrop(event, ui) {
  //console.log(event);
  //console.log(ui);
  //console.log(this);

  $(".stack").css('z-index', '500');

  var dropFill = $(this).find('.drop-fill').css("display", "none");

  var exists = $(this).find('#' + ui.draggable.data('id'));
  if (exists.length) {

    custom_alert('Already exists in dropzone.');
    return false;
  }

  $(
      '<div class="thingWrapper"><span>'
          + ui.draggable.data('name')
          + '</span> <a class="removeTag"  onclick="return removeTag( \'' + ui.draggable.data('id') + '\' )" style="opacity: 0.6;"><i class="remove glyphicon glyphicon-remove-sign glyphicon-white"></i></a></div>')
      .data('eml', ui.draggable.data('eml'))
      .attr('id', ui.draggable.data('id')).addClass('tag label btn-info sm')
      .appendTo(this);

  ui.draggable.draggable('option', 'revert', false);

  $('.removeTag').on('click', function() {
    $(this).parent().empty();
    return false;
  });

}

function _droppedThing(id, name) {
  var str = '<div id="'
      + id
      + '" class="thingWrapper tag label btn-info sm"><span>'
      + name
      + '</span> <a class="removeTag" onclick="return removeTag( \'' + id + '\' )" style="opacity: 0.6;">'
      + '<i class="remove glyphicon glyphicon-remove-sign glyphicon-white"></i></a></div>';
  return str;
}

function addDroppedThing(obj, defaultText) {
  var str = '';
  
  if ($.isArray(obj)) {
    if (obj.length) {

      $.each(obj, function(index, value) {
        if (value != null && value.hasOwnProperty('_id')) {
          str += _droppedThing(value._id, value.name);
        }
      });
    } else {
      str += '<span class="drop-fill"> ' + defaultText + ' </span>';
    }
  } else {
    str += _droppedThing(obj._id, obj.name);
  }
  return str;
}

function createItem2(itemObj) {

  //console.log(itemObj);
  var itemId = 0, itemComplete, itemTxt;
  var cmpArray = [];
  var pplArray = [];
  
  if (typeof itemObj !== "undefined") {
    itemId = itemObj._id;
    itemComplete = itemObj.complete;
    itemTxt = itemObj.text;
    cmpArray = itemObj.components;
    pplArray = itemObj.ppl;
  }

  // console.log( itemUuid );
  var newItem = '';
  newItem += '<div class="input-group item" id="' + itemId + '">';
  newItem += '<span class="input-group-addon" style="border:0px;">';
  newItem += '<input id="done" class="item-checkbox" type="checkbox" ';
  if (typeof itemComplete !== "undefined" && itemComplete) {
    newItem += 'checked ';
  }
  newItem += '>';
  newItem += '</span>';
  newItem += '<div class="row">';
  newItem += '<div class="col-lg-12" >';
  newItem += '<div class="input-group" style="display:block;">';

    
  newItem += '<textarea class="form-control item-text" id="txt" ';

  if (typeof itemComplete !== "undefined" && itemComplete) {
    newItem += ' style="text-decoration: line-through" ';
  }
  newItem += '>';
  if (typeof itemTxt !== "undefined") {
    newItem += itemTxt;
  }
  newItem += '</textarea>';
  
  newItem += '</div><!-- /input-group -->';
  
  
  
  newItem += '</div><!-- /.col-lg-12 -->';
    
    
  newItem += '<div class="col-lg-6">';
  newItem += '<div class="input-group"  style="display:block;" >';
  newItem += '<div id="item-cmp" '
      + ' class="item-cmp item-dropzone form-control">';
  newItem += addDroppedThing(cmpArray, "Drop component(s) here");
  newItem += '</div></div><!-- /input-group -->';
  newItem += '</div><!-- /.col-lg-6 -->';
  newItem += '<div class="col-lg-6" >';
  newItem += '<div class="input-group"  style="display:block;">';
  newItem += '<div id="item-ppl"'
      + ' class="item-ppl item-dropzone form-control">';
  newItem += addDroppedThing(pplArray, "Drop people here");
  newItem += '</div>';
  newItem += '</div><!-- /input-group -->';
  newItem += '</div><!-- /.col-lg-6 -->';
  newItem += '</div><!-- /.row -->';
  newItem += '</div>';

  $(newItem).appendTo("#itemPlaceholder");

  $('.item-text').autosize();

  
  $('.item-cmp').droppable({
    accept : '#cmp div',
    hoverClass : 'hovered',
    drop : handleThingDrop
  });

  $('.item-ppl').droppable({
    accept : '#ppl div',
    hoverClass : 'hovered',
    drop : handleThingDrop
  });

  $('.removeTag').on('click', function() {
    $(this).parent().empty();
    return false;
  });

  $('.item-checkbox').change(function() {
    var itemRoot = $(this).parents(".item");
    //console.log( itemRoot );

    if ($(this).is(":checked")) {
      //$(itemRoot).css("text-decoration","line-through");
      $(itemRoot).find("#txt").css("text-decoration", "line-through");
    } else {
      $(itemRoot).find("#txt").css("text-decoration", "none");
    }
  });

}

$(function() {

  $('#description').autosize();

  $('#newItem').click(function() {
    createItem2();
  });
  
 

  $('#emailTeam').click(function() {

alert( 'Not implemented yet');
return false;
    var email = 'user@domain.com';
    console.log($('#owner'));
    var o = $('#owner').children();
    console.log();
    console.log(o.attr('eml'));

    var allItems = $('#itemPlaceholder').find(".item");
    //console.log(allItems);
    $.each($.find(".thingWrapper"), function(index, onePerson) {
      console.log(onePerson);
      console.log($(onePerson));
      var addr = $(onePerson).attr('eml');
      console.log(addr);
    });
    return false;

    var subject = 'Jquery With Example';
    var emailBody = 'Hi User';
    //window.location = 'mailto:' + email + '?subject=' + subject + '&body=' + emailBody;
  });

  $('#toggleCompletedItems').on(
      'click',
      function() {
        var $el = $(this), textNode = this.lastChild;
        $el.find('span#toggle').toggleClass(
            'glyphicon-eye-close glyphicon-eye-open');
        $(textNode).html(
            ($el.hasClass('hideCompletedItems') ? 'Show All Items'
                : 'Hide Completed Items'));
        var allItems = $('#itemPlaceholder').find(".item");
        //console.log(allItems);
        var hideCompleted = $el.hasClass('hideCompletedItems');
        $.each(allItems, function(index, oneItem) {
          var chk = $(oneItem).find('span input');
          if ($(chk).is(':checked') && hideCompleted) {
            //console.log ( index + ' is checked');
            $(oneItem).css("display", "none");
          } else {
            $(oneItem).css("display", "table");
          }
        });

        $el.toggleClass('hideCompletedItems');

        return false;
      });

  $('#saveCard').on(
      'click',
      function() {
        var itemRoot = $('#itemPlaceholder div.item');
        //console.log( itemRoot );
        var json = {};
        json._id = $('#cardId').val();
        json.title = $('#cardTitle').val();
        json.desc = $('#description').val();
        
        
        var p = $('#owner').children();
        json.owner = [];
        for (var pi = 0; pi < p.length; pi++) {
          
          if (!$(p[pi]).hasClass('drop-fill') ) {
            json.owner.push($(p[pi]).attr('id'));
          }
          if( json.owner.length > 1 ) {
            alert( 'Only one owner allowed.');
            return false;
          }
        }
        //console.log( json );
// return false;       
        
        var itemsJson = [];
        for (var ii = 0; ii < itemRoot.length; ii++) {
          var item = itemRoot[ii];
          //console.log(item);
          var itemJson = {};
          itemJson._id = $(item).attr('id');
          var chk = $(item).find('span input');
          if ($(chk).is(':checked')) {
            itemJson.complete = true;
          } else {
            itemJson.complete = false;
          }
          var t = $(item).find('div textarea#txt');
          itemJson.text = t.val();

          var c = $(item).find('div#item-cmp').children();
          itemJson.cmp = [];
          
          for (var ci = 0; ci < c.length; ci++) {
            if (!$(c[ci]).hasClass('drop-fill')) {
               itemJson.cmp.push($(c[ci]).attr('id'));
            }
          }

          var p = $(item).find('div#item-ppl').children();
          itemJson.ppl = [];
          for (var pi = 0; pi < p.length; pi++) {
            if (!$(p[pi]).hasClass('drop-fill')) {
              itemJson.ppl.push($(p[pi]).attr('id'));
            }
          }

          itemsJson.push(itemJson);
        }
        json.items = itemsJson;
        //console.log(JSON.stringify(json));

        var f = $('<form action="/card/save" method="post"></form>').appendTo(
            'body');

        f.append($('<input>').attr({
          type : 'hidden',
          name : 'card',
          value : JSON.stringify(json)
        }));
        f.submit();

        return false;
      });

  $('#owner').droppable({
    accept : '#ppl div',
    hoverClass : 'hovered',
    drop : handleThingDrop
  });

});

function createButton(name, email, id, target) {

  $('<div>' + name + '</div>').data('name', name).data('email', email).data(
      'id', id).attr('id', email).addClass("tag dragbtn label btn-info sm")
      .appendTo(target).draggable({
        containment : 'body',
        zIndex : 10000,
        appendTo : "body",
        cursor : 'move',
        helper : 'clone',
        revert : true,
        start : function() {
          $(this).effect("highlight", {}, 1000);
          $(this).css("cursor", "move");
          var $par = $(this).parents('.stack');
          if ($par.length == 1) {
            console.log('in stack');
            $par.siblings().css('z-index', '400');
          }

        },
        stop : function() {
          $(this).css("cursor", "default");
          $(".stack").css('z-index', '500');
        }
      });
}

function removeTag( id ) {
  //console.log(this);
  //console.log( id );
  //console.log($(this));
  //console.log($(this).parent());
  //var a = $( '#' + id );
  //console.log( a );
  $( '#' + id ).remove();
  return false;
}

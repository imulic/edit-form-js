jQuery.browser = {};
jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());

(function( $ ) {
    

$.fn.serializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };


$.fn.editForm = function(options) {

    return this.each(function() {
    	   var settings = $.extend( {
    		      'containerId'      : this.id
    		    }, options);

    		   var onedit = settings.onedit || function() { };
    		   var onsave = settings.onsave || function() { };
    		   var oncancel = settings.oncancel || function() { };
    		   var dataElementClass = settings.dataElementClass || '.dataElement'; // Fixme: used to select data elements
    		    
        var $this =$(this);
      //  var revert = $this.html();
    //    console.log('entry point edit form');
    //    console.log($this);
        
        settings.editButton = $this.find("div.editButtons:first a[data-id='"+settings.editButtonDataId+"']");
        settings.cancelButton = $this.find("div.editButtons:first a[data-id='"+settings.cancelButtonDataId+"']");
        
        settings.cancelButton.hide();
     //   console.log(settings.cancelButton);
                
        settings.cancelButton.click(function(event){
           // $this.html(revert);
            settings.displayDiv.toggle();
            settings.inputDiv.toggle();
            
            settings.editButton.text(settings.editText);
            $(this).hide();
            event.preventDefault();
            oncancel.apply($this,[settings]);
            
            if ($(settings.cancelButton).data('i_am_new')===1){
            	$this.remove();
            	console.log('removed initial cancelled record');
            }
            
        });
        
        //FIXME:  $this.find('.editClass').click() 
        
        settings.editButton.click(function(event) {
               console.log("got a button by it's class");
            event.preventDefault();
            
            //console.log(settings.editButton.text());
           // console.log(settings.editText);
            
             if ( settings.editButton.text() == settings.editText) {         
                 console.log('editing in progress, entry point on edit click, cancel button by siblings ');
                // var cancel = $(this).siblings("a[data-id='cancel']");
                // console.log(cancel);
                // console.log('this on click contest');
                // console.log($(this));
                 
                 settings.editButton = $(this);
                 settings.cancelButton =  $(this).siblings("a[data-id='cancel']");
                 
                 //settings.editButton = $this.find("div.editButtons:first a[data-id='"+settings.editButtonDataId+"']");
                 //settings.cancelButton = $this.find("div.editButtons:first a[data-id='"+settings.cancelButtonDataId+"']");
                 
                 //console.log(settings.cancelButton);
                 
                 settings.displayDiv = $(event.target).parent().parent().children("div[data-id='"+settings.displayDivDataId+"']"); // FIXME: be general
                 
                 //console.log(settings.displayDiv);
                 settings.inputDiv = $(event.target).parent().parent().children("div[data-id='"+settings.inputDivDataId+"']"  );
                // console.log(settings.inputDiv);
                 
                 
                 settings.displayDiv.toggle();
                 
                 settings.inputDiv.toggle();
                // settings.cancelButton.text(settings.cancelText);
                 
                //var cancel = settings.editButton.siblings("a[data-id='cancel']");
                // console.log(cancel);
                // cancel.show();
                 settings.cancelButton.show();
                 
               //  console.log(settings.displayDiv);
                 console.log(dataElementClass);
                 
                 settings.displayDiv.find(dataElementClass).each(function(i){
                	console.log(this) ;
                 });
                                //was div selector below
                 settings.displayDiv.find(dataElementClass).each(function(i){ // FIXME: make it more generic to use classes
                     //console.log(this.id);
                      var e = settings.inputDiv.find('input[name="'+this.id+'"]');
                    //  console.log(e);
                     //var e = settings.inputDiv.find(":input");
                     if (!e.length) {
                         //try to select text area
                         
                         var e = settings.inputDiv.find('textarea[name="'+this.id+'"]');
                      //   console.log(e);
                       }
                     
                     if (e.length) {                              
                         if ( jQuery.browser.msie ) {
                               $.trim(e.val( $(this).text()));
                         } 
                           else {
                            e.val( $(this).text().trim()); 
                           }
                        }
                     else {
                          console.log('Oops, input element empty in input div ID = '+this.id);
                     }
                  });
                 
                  //$(this).text(settings.saveText);
                 console.log('trying to change text of edit button');
                 console.log(settings.editButton);
                 settings.editButton.text(settings.saveText);
                 onedit.apply($this,[settings]);
               
             }
            else if ( settings.editButton.text() == settings.saveText) {
            	
            	settings.cancelButton =  $(this).siblings("a[data-id='cancel']");
            	
            	console.log($(settings.cancelButton).data());
            	
            	if ($(settings.cancelButton).data('i_am_new')===1) {
            		$(settings.cancelButton).data('i_am_new',0);
            	}
            	
            	console.log($(settings.cancelButton).data());
                       
                var json_form = settings.inputDiv.find("form").serializeObject();
                
                if  (settings.debugOutput.length) {
                   settings.debugOutput.text(JSON.stringify(json_form));
                     
                 }
       
          
                var _data = {};
                _data=json_form;
               
                $this.result = 0;
                var jqxhr = $.ajax({
                    type: "POST",
                    url: settings.url,
                    data : _data,
                    dataType: "text",
                    success: function(xhr) {
                        //console.log(this);
                        $(this).result=true;
                        //console.log(this.result);
                        if(xhr == 'error') {
                            alert("error");
                            
                            
                        } else {
                            // replace data elements on the form 
                             settings.displayDiv.filter("div").find("div").each(function(i){
                                  $(this).text(json_form[this.id]);
                            });
                        
                        settings.displayDiv.toggle();
                        settings.inputDiv.toggle();
                        
                        settings.editButton.text(settings.editText) ;
                       // settings.cancelButton.text("");
                        settings.cancelButton.hide();
                        
                        
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log(XMLHttpRequest.responseText);
                        console.log(textStatus);
                        console.log(errorThrown);
                        var str = XMLHttpRequest.responseText;
                        str = str.substring(str.indexOf(':')+1,str.indexOf('-'));
                        alert(str);
                    }
                });
                
                onsave.apply($this,[settings]);
            //    $('html,body').animate({ scrollTop: settings.displayDiv.offset().top }, 500);
                
                
             };
       });
            
    })
};
})( jQuery );

/*
$('#addx').click(function(event){
     event.preventDefault();
     var e = $("#parent_to_copy").clone(true).appendTo($(event.target).parent());
     $(event.target).insertAfter(e);
 });

    $("#input").hide(); 
    $(".editSection").editForm({
        url            : "http://localhost:9000/user/1/updateProfile", 
        displayDivClass   : "editSectionx", 
        inputDivClass  : "input_div",
        inputFormID    : "form_work",
        debugOutput    : $("#result"),
        editText       : 'Edit',
        cancelText     : 'Cancel',
        saveText       : 'Save' 
    });
*/

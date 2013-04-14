
/**
* Common JS functions for form settings and form editor pages.
*/

jQuery(document).ready(function($){

    if($(document).on){
        $(document).on('change', '.gfield_rule_value_dropdown', function(){
            SetRuleValueDropDown($(this));
        });
    }
    else{
        $('.gfield_rule_value_dropdown').live('change', function(){
            SetRuleValueDropDown($(this));
        });
    }
    
    // init merge tag auto complete
    if(typeof form != 'undefined')
        new gfMergeTagsObj(form);
    
});

function ToggleConditionalLogic(isInit, objectType){
    var speed = isInit ? "" : "slow";
    if(jQuery('#' + objectType + '_conditional_logic').is(":checked")){

        var obj = GetConditionalObject(objectType);

        CreateConditionalLogic(objectType, obj);

        //Initializing object so it has the default options set
        SetConditionalProperty(objectType, "actionType", jQuery("#" + objectType + "_action_type").val());
        SetConditionalProperty(objectType, "logicType", jQuery("#" + objectType + "_logic_type").val());
        SetRule(objectType, 0);

        jQuery('#' + objectType + '_conditional_logic_container').show(speed);
    }
    else{
        jQuery('#' + objectType + '_conditional_logic_container').hide(speed);
    }

}

function GetConditionalObject(objectType){
    switch(objectType){
        case "page" :
        case "field" :
            return GetSelectedField();
        break;

        case "next_button" :
            var field = GetSelectedField();
            return field["nextButton"];
        break;

        case "confirmation":
            return confirmation;
        break;

        case "notification":
            return current_notification;
        break;

        default:
            return form.button;
        break;
    }
}

function CreateConditionalLogic(objectType, obj){

    if(!obj.conditionalLogic)
        obj.conditionalLogic = new ConditionalLogic();

    var hideSelected = obj.conditionalLogic.actionType == "hide" ? "selected='selected'" :"";
    var showSelected = obj.conditionalLogic.actionType == "show" ? "selected='selected'" :"";
    var allSelected = obj.conditionalLogic.logicType == "all" ? "selected='selected'" :"";
    var anySelected = obj.conditionalLogic.logicType == "any" ? "selected='selected'" :"";
    var imagesUrl = '';

    var objText;
    if(objectType == "field")
        objText = gf_vars.thisFieldIf;
    else if(objectType == "page")
        objText = gf_vars.thisPage;
    else if(objectType == "confirmation")
        objText = gf_vars.thisConfirmation
    else if(objectType == "notification")
        objText = gf_vars.thisNotification
    else
        objText = gf_vars.thisFormButton;

    var str = "<select id='" + objectType + "_action_type' onchange='SetConditionalProperty(\"" + objectType + "\", \"actionType\", jQuery(this).val());'><option value='show' " + showSelected + ">" + gf_vars.show + "</option><option value='hide' " + hideSelected + ">" + gf_vars.hide + "</option></select>";
    str += objText;
    str += "<select id='" + objectType + "_logic_type' onchange='SetConditionalProperty(\"" + objectType + "\", \"logicType\", jQuery(this).val());'><option value='all' " + allSelected + ">" + gf_vars.all + "</option><option value='any' " + anySelected + ">" + gf_vars.any + "</option></select>";
    str += " " + gf_vars.ofTheFollowingMatch;

    for(var i=0; i < obj.conditionalLogic.rules.length; i++){
        var isSelected = obj.conditionalLogic.rules[i].operator == "is" ? "selected='selected'" :"";
        var isNotSelected = obj.conditionalLogic.rules[i].operator == "isnot" ? "selected='selected'" :"";
        var greaterThanSelected = obj.conditionalLogic.rules[i].operator == ">" ? "selected='selected'" :"";
        var lessThanSelected = obj.conditionalLogic.rules[i].operator == "<" ? "selected='selected'" :"";
        var containsSelected = obj.conditionalLogic.rules[i].operator == "contains" ? "selected='selected'" :"";
        var startsWithSelected = obj.conditionalLogic.rules[i].operator == "starts_with" ? "selected='selected'" :"";
        var endsWithSelected = obj.conditionalLogic.rules[i].operator == "ends_with" ? "selected='selected'" :"";

        str += "<div width='100%'>" + GetRuleFields(objectType, i, obj.conditionalLogic.rules[i].fieldId);
        str += "<select id='" + objectType + "_rule_operator_" + i + "' onchange='SetRuleProperty(\"" + objectType + "\", " + i + ", \"operator\", jQuery(this).val());'><option value='is' " + isSelected + ">" + gf_vars.is + "</option><option value='isnot' " + isNotSelected + ">" + gf_vars.isNot + "</option><option value='>' " + greaterThanSelected + ">" + gf_vars.greaterThan + "</option><option value='<' " + lessThanSelected + ">" + gf_vars.lessThan + "</option><option value='contains' " + containsSelected + ">" + gf_vars.contains + "</option><option value='starts_with' " + startsWithSelected + ">" + gf_vars.startsWith + "</option><option value='ends_with' " + endsWithSelected + ">" + gf_vars.endsWith + "</option></select>";
        str += GetRuleValues(objectType, i, obj.conditionalLogic.rules[i].fieldId, obj.conditionalLogic.rules[i].value);
        str += "<img src='" + gf_vars.baseUrl + "/images/add.png' class='add_field_choice' title='add another rule' alt='add another rule' style='cursor:pointer; margin:0 3px;' onclick=\"InsertRule('" + objectType + "', " + (i+1) + ");\" />";
        if(obj.conditionalLogic.rules.length > 1 )
            str += "<img src='" + gf_vars.baseUrl + "/images/remove.png' title='remove this rule' alt='remove this rule' class='delete_field_choice' style='cursor:pointer;' onclick=\"DeleteRule('" + objectType + "', " + i + ");\" /></li>";

        str += "</div>";
    }

    jQuery("#" + objectType + "_conditional_logic_container").html(str);

    //initializing placeholder script
    jQuery.Placeholder.init();
}

function GetRuleFields(objectType, ruleIndex, selectedFieldId){
    var str = "<select id='" + objectType + "_rule_field_" + ruleIndex + "' class='gfield_rule_select' onchange='jQuery(\"#" + objectType + "_rule_value_" + ruleIndex + "\").replaceWith(GetRuleValues(\"" + objectType + "\", " + ruleIndex + ", jQuery(this).val())); SetRule(\"" + objectType + "\", " + ruleIndex + "); '>";
    var inputType;
    for(var i=0; i<form.fields.length; i++){
        if(IsConditionalLogicField(form.fields[i])){
            var selected = form.fields[i].id == selectedFieldId ? "selected='selected'" : "";
            var label = form.fields[i].adminLabel ? form.fields[i].adminLabel : form.fields[i].label
            str += "<option value='" + form.fields[i].id + "' " + selected + ">" + label + "</option>";
        }
    }
    str += "</select>";
    return str;
}

function IsConditionalLogicField(field){
    inputType = field.inputType ? field.inputType : field.type;
    var supported_fields = ["checkbox", "radio", "select", "text", "website", "textarea", "email", "hidden", "number", "phone", "multiselect", "post_title",
                            "post_tags", "post_custom_field", "post_content", "post_excerpt"];

    var index = jQuery.inArray(inputType, supported_fields);
    var isConditionalLogicField = index >= 0 ? true : false;
	isConditionalLogicField = gform.applyFilters('gform_is_conditional_logic_field', isConditionalLogicField, field);
    return isConditionalLogicField;
}

function GetRuleValues(objectType, ruleIndex, selectedFieldId, selectedValue){

    if(selectedFieldId == 0)
        selectedFieldId = GetFirstRuleField();

    if(selectedFieldId == 0)
        return "";

    var isAnySelected = false;
    var field = GetFieldById(selectedFieldId);

    if(!field)
        return "";

    var str = "";

    if(field["type"] == "post_category" && field["displayAllCategories"]){

        var dropdown_id = objectType + '_rule_value_' + ruleIndex;
        var dropdown = jQuery('#' + dropdown_id + ".gfield_category_dropdown");

        //don't load category drop down if it already exists (to avoid unecessary ajax requests)
        if(dropdown.length > 0){

            var options = dropdown.html();
            options = options.replace("value=\"" + selectedValue + "\"", "value=\"" + selectedValue + "\" selected=\"selected\"");
            str = "<select id='" + dropdown_id + "' class='gfield_rule_select gfield_rule_value_dropdown gfield_category_dropdown'>" + options + "</select>";
        }
        else{
            //loading categories via AJAX
            jQuery.post(ajaxurl,{   action:"gf_get_post_categories",
                                    objectType: objectType,
                                    ruleIndex: ruleIndex,
                                    selectedValue: selectedValue},
                                function(dropdown_string){
                                    if(dropdown_string){
                                        jQuery('#gfield_ajax_placeholder_' + ruleIndex).replaceWith(dropdown_string.trim());

                                        SetRuleProperty(objectType, ruleIndex, "value", jQuery("#" + dropdown_id).val());
                                    }
                                }
                        );

            //will be replaced by real drop down during the ajax callback
            str = "<select id='gfield_ajax_placeholder_" + ruleIndex + "' class='gfield_rule_select'><option>" + gf_vars["loading"] + "</option></select>";
        }
    }
    else if(field.choices){
        str = GetRuleValuesDropDown(field.choices, objectType, ruleIndex, selectedValue);
    }
    else{
        selectedValue = selectedValue ? selectedValue.replace(/'/g, "&#039;") : "";

        //create a text field for fields that don't have choices (i.e text, textarea, number, email, etc...)
        str = "<input type='text' placeholder='" + gf_vars["enterValue"] + "' class='gfield_rule_select' id='" + objectType + "_rule_value_" + ruleIndex + "' value='" + selectedValue.replace(/'/g, "&#039;") + "' onchange='SetRuleProperty(\"" + objectType + "\", " + ruleIndex + ", \"value\", jQuery(this).val());' onkeyup='SetRuleProperty(\"" + objectType + "\", " + ruleIndex + ", \"value\", jQuery(this).val());'>";
    }

    return str;
}

function GetFirstRuleField(){
    var inputType;
    for(var i=0; i<form.fields.length; i++){
        if(IsConditionalLogicField(form.fields[i]))
            return form.fields[i].id;
    }

    return 0;
}

function GetRuleValuesDropDown(choices, objectType, ruleIndex, selectedValue){
    //create a drop down for fields that have choices (i.e. drop down, radio, checkboxes, etc...)
    str = "<select class='gfield_rule_select gfield_rule_value_dropdown' id='" + objectType + "_rule_value_" + ruleIndex + "'>";

    var isAnySelected = false;
    for(var i=0; i<choices.length; i++){
        var choiceValue = typeof choices[i].value == "undefined" || choices[i].value == null ? choices[i].text + '' : choices[i].value + '';
        var isSelected = choiceValue == selectedValue;
        var selected = isSelected ? "selected='selected'" : "";
        if(isSelected)
            isAnySelected = true;

        str += "<option value='" + choiceValue.replace(/'/g, "&#039;") + "' " + selected + ">" + choices[i].text + "</option>";
    }

    if(!isAnySelected && selectedValue && selectedValue != "")
        str += "<option value='" + selectedValue.replace(/'/g, "&#039;") + "' selected='selected'>" + selectedValue + "</option>";

    str += "</select>";

    return str;

}

function SetRuleProperty(objectType, ruleIndex, name, value){
    var obj = GetConditionalObject(objectType);
    obj.conditionalLogic.rules[ruleIndex][name] = value;
}

function GetFieldById(id){
    for(var i=0; i<form.fields.length; i++){
        if(form.fields[i].id == id)
            return form.fields[i];
    }
    return null;
}

function SetConditionalProperty(objectType, name, value){
    var obj = GetConditionalObject(objectType);
    obj.conditionalLogic[name] = value;
}

function SetRuleValueDropDown(element){
        //parsing ID to get objectType and ruleIndex
        var ary = element.attr("id").split('_rule_value_');

        if(ary.length < 2)
            return;

        var objectType = ary[0];
        var ruleIndex = ary[1];

        SetRuleProperty(objectType, ruleIndex, "value", element.val());
}

function InsertRule(objectType, ruleIndex){
    var obj = GetConditionalObject(objectType);
    obj.conditionalLogic.rules.splice(ruleIndex, 0, new ConditionalRule());
    CreateConditionalLogic(objectType, obj);
    SetRule(objectType, ruleIndex);
}

function SetRule(objectType, ruleIndex){
    SetRuleProperty(objectType, ruleIndex, "fieldId", jQuery("#" + objectType + "_rule_field_" + ruleIndex).val());
    SetRuleProperty(objectType, ruleIndex, "operator", jQuery("#" + objectType + "_rule_operator_" + ruleIndex).val());
    SetRuleProperty(objectType, ruleIndex, "value", jQuery("#" + objectType + "_rule_value_" + ruleIndex).val());
}

function DeleteRule(objectType, ruleIndex){
    var obj = GetConditionalObject(objectType);
    obj.conditionalLogic.rules.splice(ruleIndex, 1);
    CreateConditionalLogic(objectType, obj);
}

function TruncateRuleText(text){
    if(!text || text.length <= 18)
        return text;

    return text.substr(0, 9) + "..." + text.substr(text.length -8, 9);

}

function gfAjaxSpinner(elem, imageSrc, inlineStyles) {
    
    var imageSrc = typeof imageSrc == 'undefined' ? '/images/ajax-loader.gif': imageSrc;
    var inlineStyles = typeof inlineStyles != 'undefined' ? inlineStyles : '';

    this.elem = elem;
    this.image = '<img class="gfspinner" src="' + imageSrc + '" style="' + inlineStyles + '" />';

    this.init = function() {
        this.spinner = jQuery(this.image);
        jQuery(this.elem).after(this.spinner);
        return this;
    }

    this.destroy = function() {
        jQuery(this.spinner).remove();
    }

    return this.init();
}

function InsertVariable(element_id, callback, variable) {
    
    if(!variable)
        variable = jQuery('#' + element_id + '_variable_select').val();

    var messageElement = jQuery("#" + element_id);

    if(document.selection) {
        // Go the IE way
        messageElement[0].focus();
        document.selection.createRange().text=variable;
    }
    else if(messageElement[0].selectionStart) {
        // Go the Gecko way
        obj = messageElement[0]
        obj.value = obj.value.substr(0, obj.selectionStart) + variable + obj.value.substr(obj.selectionEnd, obj.value.length);
    }
    else {
        messageElement.val(variable + messageElement.val());
    }

    var variableSelect = jQuery('#' + element_id + '_variable_select');
    if(variableSelect.length > 0)
        variableSelect[0].selectedIndex = 0;

    if(callback && window[callback]){
        window[callback].call(null, element_id, variable);
    }

}

function GetInputType(field){
    return field.inputType ? field.inputType : field.type;
}

function HasPostField(){
    
    for(var i=0; i<form.fields.length; i++){
        var type = form.fields[i].type;
        if(type == "post_title" || type == "post_content" || type == "post_excerpt")
            return true;
    }
    return false;
}

function GetInput(field, id){
    
    if( typeof field['inputs'] != 'undefined' && jQuery.isArray(field['inputs']) ) {
        
        for(i in field['inputs']) {
            var input = field['inputs'][i];
            if(input.id == id)
                return input;
        }
        
    }
    
    return null;
}

function IsPricingField(fieldType) {
    return IsProductField(fieldType) || fieldType == 'donation';
}

function IsProductField(fieldType) {
    return jQuery.inArray(fieldType, ["option", "quantity", "product", "total", "shipping", "calculation"]) != -1;
}

function GetLabel(field, inputId, inputOnly) {

    if(typeof inputId == 'undefined')
        inputId = 0;

    if(typeof inputOnly == 'undefind')
        inputOnly = false;
        
    //TODO: support getting admin label when appropriate
    //$field_label = (IS_ADMIN || RG_CURRENT_PAGE == "select_columns.php" || RG_CURRENT_PAGE == "print-entry.php" || rgget("gf_page", $_GET) == "select_columns" || rgget("gf_page", $_GET) == "print-entry") && !rgempty("adminLabel", $field) ? rgar($field,"adminLabel") : rgar($field,"label");
    
    var input = GetInput(field, inputId);
    
    if(field.type == "checkbox" && input != null) {
        return input.label;
    } 
    else if(input != null) {
        return inputOnly ? input.label : field.label + ' (' + input.label + ')';
    } 
    else {
        return field.label;
    }
    
}

function DeleteNotification(notificationId) {
    jQuery('#action_argument').val(notificationId);
    jQuery('#action').val('delete');
    jQuery('#notification_list_form')[0].submit();
}

function DeleteConfirmation(confirmationId) {
    jQuery('#action_argument').val(confirmationId);
    jQuery('#action').val('delete');
    jQuery('#confirmation_list_form')[0].submit();
}

function SetConfirmationConditionalLogic(isChecked) {
    
    if(typeof isChecked == 'undefined') {
        confirmation['conditionalLogic'] = jQuery('#conditional_logic').val() ? jQuery.parseJSON(jQuery('#conditional_logic').val()) : null;
    } else {
        confirmation['conditionalLogic'] = isChecked ? new ConditionalLogic() : null;
    }
    
}

function ToggleConfirmation() {

    var showElement, hideElement = '';
    var isRedirect = jQuery("#form_confirmation_redirect").is(":checked");
    var isPage = jQuery("#form_confirmation_show_page").is(":checked");
    
    if(isRedirect){
        showElement = ".form_confirmation_redirect_container";
        hideElement = "#form_confirmation_message_container, #form_confirmation_page_container";
        ClearConfirmationSettings(['text', 'page']);
    }
    else if(isPage){
        showElement = "#form_confirmation_page_container";
        hideElement = "#form_confirmation_message_container, .form_confirmation_redirect_container";
        ClearConfirmationSettings(['text', 'redirect']);
    }
    else{
        showElement = "#form_confirmation_message_container";
        hideElement = "#form_confirmation_page_container, .form_confirmation_redirect_container";
        ClearConfirmationSettings(['page', 'redirect']);
    }
    
    ToggleQueryString();
    
    jQuery(hideElement).hide();
    jQuery(showElement).show();

}

function ToggleQueryString() {
    if(jQuery('#form_redirect_use_querystring').is(":checked")){
        jQuery('#form_redirect_querystring_container').show();
    }
    else{
        jQuery('#form_redirect_querystring_container').hide();
        jQuery("#form_redirect_querystring").val('');
        jQuery("#form_redirect_use_querystring").val('');
    }
}

function ClearConfirmationSettings(type) {
    
    var types = jQuery.isArray(type) ? type : [type];
    
    for(i in types) {
        switch(types[i]) {
        case 'text':
            jQuery('#form_confirmation_message').val('');
            jQuery('#form_disable_autoformatting').prop('checked', false);
            break;
        case 'page':
            jQuery('#form_confirmation_page').val('');
            break;
        case 'redirect':
            jQuery('#form_confirmation_url').val('');
            jQuery('#form_redirect_querystring').val('');
            jQuery('#form_redirect_use_querystring').prop('checked', false);
            break;
        }    
    }
    
}

function StashConditionalLogic() {
    var string = JSON.stringify(confirmation['conditionalLogic']);
    jQuery('#conditional_logic').val(string);
}

function ConfirmationObj() {
    this.id = false;
    this.name = gf_vars.confirmationDefaultName;
    this.type = 'message';
    this.message = gf_vars.confirmationDefaultMessage;
    this.isDefault = 0;
}

var gfMergeTagsObj = function(form) {
            
    this.form = form;
    
    this.init = function() {
        
        var gfMergeTags = this;
        
        this.mergeTagList = jQuery('<ul id="gf_merge_tag_list" class=""></ul>');
        this.mergeTagListHover = false;
        
        if(jQuery('.merge-tag-support').length <= 0)
            return;
        
        jQuery( ".merge-tag-support" )
            // don't navigate away from the field on tab when selecting an item
            .bind( "keydown", function( event ) {
                if ( event.keyCode === jQuery.ui.keyCode.TAB && jQuery( this ).data( "autocomplete" ).menu.active ) {
                    event.preventDefault();
                }
            })
            .each(function(){
                
                var elem = jQuery(this);
                var classStr = elem.is('input') ? 'input' : 'textarea';

                elem.autocomplete({
                    minLength: 1,
                    source: function( request, response ) {
                        
                        // delegate back to autocomplete, but extract the last term
                        var term = gfMergeTags.extractLast( request.term );
                        
                        if(term.length < elem.autocomplete('option', 'minLength')) {
                            response( [] );
                            return;
                        }
                        
                        var tags = jQuery.map( gfMergeTags.getAutoCompleteMergeTags(elem), function(item) {
                            return gfMergeTags.startsWith( item, term ) ? item : null;
                        });
                        
                        response( tags );
                    },
                    focus: function() {
                        // prevent value inserted on focus
                        return false;
                    },
                    select: function( event, ui ) {
                        var terms = gfMergeTags.split( this.value );
                        
                        // remove the current input
                        terms.pop();
                        
                        // add the selected item
                        terms.push( ui.item.value );
                        
                        this.value = terms.join( " " );
                        return false;
                    }
                });
                
                var positionClass = gfMergeTags.getClassProperty(this, 'position');
                elem.after('<span class="all-merge-tags ' + positionClass + ' ' + classStr + '"><a class="open-list tooltip-merge-tag" tooltip="' + gf_vars.mergeTagsTooltip + '">All Merge Tags</a></span>');

            });

        jQuery('.tooltip-merge-tag').each(function() {
            var options = gform_get_tooltip_options( this, "gformsstyle_left", "topLeft", "bottomRight" );
            options.show.delay = 1250;
            gform_apply_tooltip( this, options );
        });

        jQuery('.all-merge-tags a.open-list').click(function() {

            var trigger = jQuery(this);

            var input = trigger.parents( 'span' ).prev( 'input, textarea' );
            gfMergeTags.mergeTagList.html( gfMergeTags.getMergeTagListItems( input ) );
            gfMergeTags.mergeTagList.insertAfter( trigger ).show();
            
            jQuery('ul#gf_merge_tag_list a').click(function(){
                var value = jQuery(this).data('value');
                var input = jQuery(this).parents('span').prev('input, textarea');
                InsertVariable(input.attr('id'), null, value);
                gfMergeTags.mergeTagList.hide();
            });
            
        });
        
        // hide merge tag list on off click
        this.mergeTagList.hover(function(){
            gfMergeTags.mergeTagListHover = true;
        }, function(){
            gfMergeTags.mergeTagListHover = false;
        });

        jQuery('body').mouseup(function(){
            if(!gfMergeTags.mergeTagListHover) 
                gfMergeTags.mergeTagList.hide();
        });

    }
            
    this.split = function( val ) {
        return val.split(' ');
    }
        
    this.extractLast = function( term ) {
        return this.split( term ).pop();
    }
    
    this.startsWith = function(string, value) {
        return string.indexOf(value) === 0;
    }
    
    this.getMergeTags = function(fields, elementId, hideAllFields, excludeFieldTypes, isPrepop, option) {

        if(typeof fields == 'undefined')
            fields = [];
        
        if(typeof excludeFieldTypes == 'undefined')
            excludeFieldTypes = [];
        
        var requiredFields = [], optionalFields = [], pricingFields = [];
        var ungrouped = [], requiredGroup = [], optionalGroup = [], pricingGroup = [], otherGroup = [], customGroup = [];
        
        if(!hideAllFields)
            ungrouped.push({ tag: '{all_fields}', 'label': this.getMergeTagLabel('{all_fields}') });
        
        if(!isPrepop) {
        
            // group fields by required, optional and pricing
            for(i in fields) {
                
                var field = fields[i];
                
                if(field['displayOnly'])
                    continue;
                
                var inputType = GetInputType(field);
                if(jQuery.inArray(inputType, excludeFieldTypes) != -1)
                    continue;
                
                if(field.isRequired) {
                    
                    switch(inputType) {
                    
                    case 'name':
                        
                        if(field['nameFormat'] == 'extended') {
                            
                            var prefix = GetInput(field, field.id + '.2');
                            var suffix = GetInput(field, field.id + '.8');
                            
                            var optionalField = field;
                            optionField['inputs'] = [prefix, suffix];
                            
                            // add optional name fields to optional list
                            optionalFields.push(optionalField);
                            
                            // remove option name fields from required list
                            delete field.inputs[0];
                            delete field.inputs[3];
                            
                        }
                        
                        requiredFields.push(field);
                        break;
                    
                    default:
                        requiredFields.push(field);
                    }
                    
                } else {
                    
                    optionalFields.push(field);
                    
                }
                
                if(IsPricingField(field.type)) {
                    pricingFields.push(field);
                }
                
            }
            
            if(requiredFields.length > 0) {
                for(i in requiredFields) {
                    requiredGroup = requiredGroup.concat(this.getFieldMergeTags(requiredFields[i], option));
                }
            }
            
            if(optionalFields.length > 0) {
                for(i in optionalFields) {
                    optionalGroup = optionalGroup.concat(this.getFieldMergeTags(optionalFields[i], option));
                }
            }
            
            if(pricingFields.length > 0) {
            
                if(!hideAllFields)
                    pricingGroup.push({ tag: '{pricing_fields}', 'label': this.getMergeTagLabel('{pricing_fields}') });

                for(i in pricingFields) {
                    pricingGroup.concat(this.getFieldMergeTags(pricingFields[i], option));
                }

            }
        
        }
        
        otherGroup.push( { tag: '{ip}', label: this.getMergeTagLabel('{ip}') });
        otherGroup.push( { tag: '{date_mdy}', label: this.getMergeTagLabel('{date_mdy}') });
        otherGroup.push( { tag: '{date_dmy}', label: this.getMergeTagLabel('{date_dmy}') });
        otherGroup.push( { tag: '{embed_post:ID}', label: this.getMergeTagLabel('{embed_post:ID}') });
        otherGroup.push( { tag: '{embed_post:post_title}', label: this.getMergeTagLabel('{embed_post:post_title}') });
        otherGroup.push( { tag: '{embed_url}', label: this.getMergeTagLabel('{embed_url}') });
        otherGroup.push( { tag: '{entry_id}', label: this.getMergeTagLabel('{entry_id}') });
        otherGroup.push( { tag: '{entry_url}', label: this.getMergeTagLabel('{entry_url}') });
        otherGroup.push( { tag: '{form_id}', label: this.getMergeTagLabel('{form_id}') });
        otherGroup.push( { tag: '{form_title}', label: this.getMergeTagLabel('{form_title}') });
        otherGroup.push( { tag: '{user_agent}', label: this.getMergeTagLabel('{user_agent}') });

        if(HasPostField() && !isPrepop) { // TODO: consider adding support for passing form object or fields array
            otherGroup.push( { tag: '{post_id}', label: this.getMergeTagLabel('{post_id}') });
            otherGroup.push( { tag: '{post_edit_url}', label: this.getMergeTagLabel('{post_edit_url}') });
        }

        otherGroup.push( { tag: '{user:display_name}', label: this.getMergeTagLabel('{user:display_name}') });
        otherGroup.push( { tag: '{user:user_email}', label: this.getMergeTagLabel('{user:user_email}') });
        otherGroup.push( { tag: '{user:user_login}', label: this.getMergeTagLabel('{user:user_login}') });

        var customMergeTags = this.getCustomMergeTags();
        if( customMergeTags.tags.length > 0 ) {
            for( i in customMergeTags.tags ) {
                var customMergeTag = customMergeTags.tags[i];
                customGroup.push( { tag: customMergeTag.tag, label: customMergeTag.label } );
            }
        }

        var mergeTags = {
            ungrouped: {
                label: this.getMergeGroupLabel('ungrouped'),
                tags: ungrouped
            },
            required: {
                label: this.getMergeGroupLabel('required'),
                tags: requiredGroup
            },
            optional: {
                label: this.getMergeGroupLabel('optional'),
                tags: optionalGroup
            },
            pricing: {
                label: this.getMergeGroupLabel('pricing'),
                tags: pricingGroup
            },
            other: {
                label: this.getMergeGroupLabel('other'),
                tags: otherGroup
            },
            custom: {
                label: this.getMergeGroupLabel('custom'),
                tags: customGroup
            }
        }
        
        mergeTags = gform.applyFilters('gform_merge_tags', mergeTags, elementId, hideAllFields, excludeFieldTypes, isPrepop, option);
        
        return mergeTags;
    }

    this.getMergeTagLabel = function(tag) {
        
        for(groupName in gf_vars.mergeTags) {
            var tags = gf_vars.mergeTags[groupName].tags;
            for(i in tags) {
                if(tags[i].tag == tag)
                    return tags[i].label;
            }
        }
        
        return '';
    }

    this.getMergeGroupLabel = function(group) {
        return gf_vars.mergeTags[group].label;
    }

    this.getFieldMergeTags = function(field, option) {
        
        if(typeof option == 'undefined')
            option = '';
        
        var mergeTags = [];
        var inputType = GetInputType(field);
        var tagArgs = inputType == "list" ? ":" + option : ""; //option currently only supported by list field
        var value = '', label = '';

        if( typeof field['inputs'] != 'undefined' && jQuery.isArray(field['inputs']) ) {
            
            if(inputType == 'checkbox') {
                label = GetLabel(field, field.id).replace("'", "\\'");
                value = "{" + label + ":" + field.id + tagArgs + "}";
                mergeTags.push( { tag: value, label: label } );
            }

            for(i in field.inputs) {
                var input = field.inputs[i];
                label = GetLabel(field, input.id).replace("'", "\\'");
                value = "{" + label + ":" + input.id + tagArgs + "}";
                mergeTags.push( { tag: value, label: label } );
            }
            
        }
        else {
            label = GetLabel(field).replace("'", "\\'");
            value = "{" + label + ":" + field.id + tagArgs + "}";
            mergeTags.push( { tag: value, label: label } );
        }
        
        return mergeTags;
    }

    this.getCustomMergeTags = function() {
        for(groupName in gf_vars.mergeTags) {
            if(groupName == 'custom')
                return gf_vars.mergeTags[groupName];
        }
        return [];
    }

    this.getAutoCompleteMergeTags = function(elem) {
        
        var fields = this.form.fields;
        var elementId = elem.attr('id');
        var hideAllFields = this.getClassProperty(elem, 'hide_all_fields') == true;
        var excludeFieldTypes = this.getClassProperty(elem, 'exclude');
        var option = this.getClassProperty(elem, 'option');
        var isPrepop = this.getClassProperty(elem, 'prepopulate');
        
        if(isPrepop) {
            hideAllFields = true;
        }
        
        var mergeTags = this.getMergeTags(fields, elementId, hideAllFields, excludeFieldTypes, isPrepop, option);
        
        var autoCompleteTags = [];
        for(group in mergeTags) {
            var tags = mergeTags[group].tags;
            for(i in tags) {
                autoCompleteTags.push(tags[i].tag);
            }
        }
        
        return autoCompleteTags;
    }
    
    this.getMergeTagListItems = function(elem) {
        
        var fields = this.form.fields;
        var elementId = elem.attr('id');
        var hideAllFields = this.getClassProperty(elem, 'hide_all_fields') == true;
        var excludeFieldTypes = this.getClassProperty(elem, 'exclude');
        var isPrepop = this.getClassProperty(elem, 'prepopulate');
        var option = this.getClassProperty(elem, 'option');
        
        if(isPrepop) {
            hideAllFields = true;
        }
        
        var mergeTags = this.getMergeTags(fields, elementId, hideAllFields, excludeFieldTypes, isPrepop, option);
        var hasMultipleGroups = this.hasMultipleGroups(mergeTags);
        var optionsHTML = '';
        
        for(group in mergeTags) {
            
            var label = mergeTags[group].label
            var tags = mergeTags[group].tags;
            
            // skip groups without any tags
            if(tags.length <= 0)
                continue;
            
            // if group name provided
            if(label && hasMultipleGroups)
                optionsHTML += '<li class="group-header">' + label + '</li>';
            
            for(i in tags) {
                var tag = tags[i];
                optionsHTML += '<li class=""><a class="" data-value="' + tag.tag + '">' + tag.label + '</a></li>';
            }
            
        }
        
        return optionsHTML;
    }
    
    this.hasMultipleGroups = function(mergeTags) {
        var count = 0;
        for(group in mergeTags) {
            if(mergeTags[group].tags.length > 0)
                count++;
        }
        return count > 1;
    }
    
    /**
    * Merge Tag inputs support a system for setting various properties for the merge tags via classes.
    *   e.g. mt-{property}-{value}
    * 
    * You can pass multiple values for a property like so:
    *   e.g. mt-{property}-{value1}-{value2}-{value3}
    * 
    * Current classes:
    *   mt-hide_all_fields  
    *   mt-exclude-{field_type}         e.g. mt-exlude-paragraph
    *   mt-option-{option_value}        e.g. mt-option-url
    *   mt-position-{position_value}    e.g. mt-position-right
    * 
    */
    this.getClassProperty = function(elem, property) {
        
        var elem = jQuery(elem);
        var classStr = elem.attr('class');
        
        if(!classStr)
            return '';
            
        var classes = classStr.split(' ');
        
        for(i in classes) {
            
            var pieces = classes[i].split('-');
            
            // if this is not a merge tag class or not the property we are looking for, skip
            if(pieces[0] != 'mt' || pieces[1] != property)
                continue;
            
            // if more than one value passed, return all values
            if(pieces.length > 3) {
                delete pieces[0];
                delete pieces[1];
                return pieces;
            } 
            // if just a property is passed, assume we are looking for boolean, return true
            else if(pieces.length == 2){
                return true;
            // in all other cases, return the value
            } else {
                return pieces[2];
            }
            
        }
        
        return '';
    }
    
    this.init();
    
}
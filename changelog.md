# 0.5.1
- Fixes for the Autocomplete drag'n'drop functionality - rewrote the events logic and moved it to the whole rui-input-container, rather than the file input preview.

# 0.5.0
- Huge improvement to the Autocomplete input - it now has a dedicated, mat-dialog based mobile mode - just set isMobile: true in the autocomplete's config.
- Fixed the Autocomplete With Chips's required flag - it no longer displays an error message when chips have been selected but the searchBox is empty.
- Added image cropping functionality to the file input.
- Added drag and drop functionality to the file input.
- Updated some dependencies.

# 0.4.1
- Small fix for the Autocomplete input - under very rare circumstances, the selectList property of fieldData is undefined. Add checks for that.

# 0.4.0
- Massive imrovements to the Autocomplete input:
-> Upgraded the matching algorithm - it now takes exact matches first, then matches that start with the typed in string, then matches that contain it.
-> Fixed the issue with the last letter not being matched.
-> Added the option to provide a noMatchesOptionAction in the autocomplete config, which will be executed when clicked on when no matches are found. The logic requires both noMatchesOptionAction and noMatchesOptionText to be provided.
-> Pressing the Enter key now selects the first option (if any) when no option is selected.

# 0.3.9
- Added a "startTypingForSuggestions" option to the Autocomplete input's fieldData interface. If set to true, it will display the according message and require at least 2 symbols typed in to start displaying data to the user.

# 0.3.8
- Added a timestamp-based "name" attribute to the autocomplete input in the hopes of fixing the suggestions issue. Also prepared a possible solution using ZWSP symbols, but commented it out for now as it's more complex and error-prone.

# 0.3.7
- Reverted the last hotfix, as it breaks the floating labels.

# 0.3.6
- Hotfixed the autocomplete suggestions issue.

# 0.3.5
- Autocomplete dynamic API filtering - if "filters" is passed as arg, it shouldn't be overwritten.

# 0.3.4
- Added the ability to dynamically filter the select list in the autocomplete component by the current value.

# 0.3.3
- Added 2 new options to BaseInputInterface and the relevant inputs - label and usePlaceholderAsLabel. If "label" is provided, it allows you to set a label separte from the placeholder. If no label is provided as usePlaceholderAsLabel is not false (the current behaviour so far), the provided placeholder will be used as the label.

# 0.3.2
- MaxChipCount actually works now.

# 0.3.1
- Added a maxChipCount option to the autocomplete component.

# 0.3.0
- Added a selectListLoaded observable to the autocomplete and select inputs and their interfaces.

# 0.2.1
- Added floatLabel and hideRequiredMarker to all inputs and their interfaces.

# 0.2.0
- Added an inputElementRef to all inputs.

# 0.1.10
- Finally fixed the file input previewDefaultImageUrl functionality

# 0.1.9
- Aaaand more debugging.

# 0.1.8
- Just some more debugging.

# 0.1.7
- Just some debugging.

# 0.1.6
- Fix for the file input.

# 0.1.5
- File input - updated the file input preview default background image to support dynamic change of the url.

# 0.1.4
- Min and max date for the datepicker.

# 0.1.3
- Added forceShowPreviewCancelButton functionality to the file input (use previewCancelButtonForceShowInitially in the file input interface).

# 0.1.2
- The file input direct upload image preview now correctly displays the default and current images.

# 0.1.1
- Added a previewCancelButton option and a previewCancelButtonIcon option to the file input interface (and the related functionality in the file input).
- The datepicker input now opens its calendar when clicking on the input itself.

# 0.1.0
- Moved to ramster-ui-core v0.1.
- Added an initial file preview image to the file input.
- Added showChooseFileButton to the file input config, true by default.

# 0.0.44
- The option from v0.0.43 now actually works.

# 0.0.43
- Added the option to switch between round and square preview for the file input.

# 0.0.42
- Added hint actions support to the base input.

# 0.0.41
- Checkbox inputs now support links for the label.

# 0.0.40
- Improved file ulpload error handling even further.

# 0.0.39
- Improved file ulpload error handling.

# 0.0.38
- Added min and max to the default input - to be used with type=number.

# 0.0.37
- Fixed the autocomplete and select inputs selectListRESTServiceMethodName behaviour for regular, non-slave inputs.

# 0.0.36
- Added readOnly support for all inputs.

# 0.0.35
- Autocomplete - fixed the initial value issues with slave inputs.

# 0.0.34
- Fixed the wysiwyg label margin.
- Possible autocomplete slave input fix.

# 0.0.33
- Autocomplete hotfix.

# 0.0.32
- The autocomplete input now sets the correct searchBox value on init and initial select list load.
- FormInjector UI WIP.
- Added a wysiwyg input.
- Dependency updates.

# 0.0.31
- Fixed the default "No file chosen" label for the file input.
- Added a fallback width of 100% to the formBuilder layout.

# 0.0.30
- Fix for the formBuilder input initialValues.

# 0.0.29
- Add an ability to build grid-based (row & column) layouts to formBuilder.buildForm.
- Fixed the inputInjector for regular inputs - text, number, etc.
- Addeded a formInjector component - takes a form layout that's been generated from formBuilder.buildForm and renders it. Still needs work, though.

# 0.0.28
- Added an optional initialValue field to the FormFieldsInterface.

# 0.0.27
- Added a selectListRESTServiceMethodName option to the autocomplete.

# 0.0.26
- FormBuilder - added automatic mapping of validations.

# 0.0.25
- Updated the ramster-ui-core dependency.
- Added a formBuilder service.
- Added an InputInjector component which automates the whole *ngIf process for different types of inputs.
- Updated the test page.

# 0.0.24
- Fix for the file input - now using elementRef to activate the label, instead of html5 id on it. Using the id used to cause the file always going to the first input element only if there are multiple rui-inputs in the page.

# 0.0.23
- Fix for the autocomplete - increased the onBlur follow-up timer from 100 ms to 250 ms to make sure it waits for the onSelectionChange event.

# 0.0.22
- The autocomplete input with hasChips set to true now correctly and automatically populates the list of chips programatically when needed.

# 0.0.21
- Removed the node version badge from readme.md.
- Fixed the aria-describedby error in the rui-autocomplete input.
- Added arrayNotEmpty and objectNotEmpty validators.
- Added the ability to pass options to mat-datepicker.

# 0.0.20
- Peer deps update.

# 0.0.19
- Added chips support to the autocomplete input. Just set hasChips to true in the fieldData interface.

# 0.0.18
- Made the input containers full width and height.

# 0.0.17
- Added a select input.

# 0.0.16
- Fixed the imports bug. You can now also import RamsterUIForms module instead of InputsModule in your app main file.

# 0.0.15
- Added a wrapper div to the checkbox.
- Finally fixed the datepicker.
- Fixed the slideToggle by replacing the mat-form-field wrapper with a div.
- Extended the testApp to include everything.

# 0.0.14
- Added a test folder and a small test app in it.
- Added the dist folder to gitignore.
- Removed the test folder from gitignore.

# 0.0.13
- File input update.

# 0.0.12
- Aaaaand another one.

# 0.0.11
- And another one.

# 0.0.10
- Fix for the functionality from the latest version.

# 0.0.9
- Added a currentSelectionIndex to the autocomplete input component and wrote functionality for setting the searchbox value when the inputFormControl value is patched externally.

# 0.0.8
- Added an optional callback Observable Subject to AutocompleteFieldDataInterface to be called when the masterInputFormControl's value has changed and the select list has finished loading.
- Updated the ramster-ui-core peerDep.

# 0.0.7
- Updated the deps.

# 0.0.6
- Publishing only the dist folder. Naming changes.

# 0.0.5
- The app is now being built using ng-packagr.
- Removed old dependencies.

# 0.0.4
- Added an index.js file.

# 0.0.3
- Whoops! Forgot to build stuff! Hehe :)
- Added a build script to package.json.

# 0.0.2
- Moved all deps to peerDeps. Fixed the inputs' imports.

# 0.0.1
- The initial version.

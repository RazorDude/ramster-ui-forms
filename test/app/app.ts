'use strict'

// angular dependencies
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {BrowserModule} from '@angular/platform-browser'
import {FlexLayoutModule} from '@angular/flex-layout'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http'
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatSlideToggleModule,
	MatTabsModule,
	MatTableModule,
	MatPaginatorModule,
	MatSelectModule,
	MatStepperModule,
	MatSortModule,
	MatChipsModule
} from '@angular/material'
import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'

// rest API and related services
import {TestModelRESTService} from './models/test/test.restService'

// ramster components and services
import {FilesRESTService, GlobalEventsService, RamsterUICoreModule, RequestService} from 'ramster-ui-core'
import {FormBuilderService, RamsterUIFormsModule} from '../../src'

import {LayoutComponent} from './layout/layout.component'

// page components
import {HomePageComponent} from './pages/home/home.component'



const routes: Routes = [
	{path: '', component: HomePageComponent }
]

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
		BrowserModule,
		BrowserAnimationsModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatSlideToggleModule,
		MatTabsModule,
		MatTableModule,
		MatPaginatorModule,
		MatSelectModule,
		MatSortModule,
		MatStepperModule,
		MatChipsModule,
		RamsterUICoreModule,
		RamsterUIFormsModule
	],
	exports: [RouterModule],
	declarations: [
		LayoutComponent,
		HomePageComponent
	],
	providers: [
		FilesRESTService,
		FormBuilderService,
		GlobalEventsService,
		RequestService,
		TestModelRESTService
	],
	bootstrap: [LayoutComponent]
})
class AppModule {}

export {AppModule}

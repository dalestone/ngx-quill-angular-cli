import { Component, ViewChild, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { QuillEditorComponent } from 'ngx-quill';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

import 'quill-mention';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('editor') editor: QuillEditorComponent;
  modules = {};
  contents = 'DATA HERE'

  constructor(private _sanitizer: DomSanitizer) {
    const values = [
      { id: 1, value: 'Fredrik Sundqvist' },
      { id: 2, value: 'Patrik Sjölin' }
    ];

    this.modules = {
      toolbar: {
        container: [
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image', 'video']
        ]
      },
      imageResize: true,
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        source: function (searchTerm, renderList) {
          if (searchTerm.length === 0) {
            renderList(values, searchTerm);
          } else {
            const matches = [];
            for (let i = 0; i < values.length; i++)
              if (~values[i].value.toLowerCase().indexOf(searchTerm)) matches.push(values[i]);
            renderList(matches, searchTerm);
          }
        },
      }
    }
  }

  ngOnInit() {
    //this.editor.modules = this.modules;

    this.editor.onContentChanged.subscribe((data) => {
      console.log(data.html);
      this.contents = this._sanitizer.sanitize(SecurityContext.HTML, data.html);
    });
  }
}



import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Code has been adapted (with permission) for Angular from Sarah Drasner's Vue.js Azure Emotion API on CodePen
  // Sarah: https://twitter.com/sarah_edo
  // CodePen: https://codepen.io/sdras/details/dZOdpv

  name = 'Angular 5';
  image;
  noFace;
  thing;
  result;
  fileToUpload: File;

  constructor(private http: HttpClient) {}

  useMine() {
    this.image = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/happiness.jpg';
    this.emotionReq();
  }

  removeImage() {
    this.image = '';
    this.noFace = false;
    this.thing = {};
    this.result = '';
    this.fileToUpload = undefined;
  }

  fileUpload(fileList: FileList) {
    if (fileList.length <= 0) return;

    this.fileToUpload = fileList.item(0);
    this.createImage();
  }

  emotionReq() {
    let data, contentType;
    if (typeof this.image === 'string' && !this.image.startsWith('data')) {
      data = { url: this.image };
      contentType = 'application/json';
    } else {
      data = this.fileToUpload;
      contentType = 'application/octet-stream';
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': contentType,
        'Ocp-Apim-Subscription-Key': '<add your key here>'
      })
    };

    this.http
      .post(
        'https://southcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion',
        data,
        httpOptions
      )
      .subscribe(body => {
        if (body && body[0]) {
          this.thing = body[0].faceAttributes.emotion;
          this.result = this.highest();
          this.noFace = false;
        } else {
          this.noFace = true;
        }
      });
  }

  createImage() {
    var reader = new FileReader();

    reader.onload = e => {
      this.image = reader.result;
      this.emotionReq();
    };
    reader.readAsDataURL(this.fileToUpload);
  }

  highest() {
    //in this situation, functional would have been a lot more convulted and less legible
    //if you don't agree, there's a fork button ;)
    let max = 0;
    let maxkey = '';
    for (var key in this.thing) {
      if (this.thing[key] > max) {
        max = this.thing[key];
        maxkey = key;
      }
    }
    return maxkey;
  }
}

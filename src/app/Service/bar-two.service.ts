import { Injectable } from '@angular/core';
import Quagga from 'quagga';
import { DECODER_CONFIG, DECODER_LIVE_CONFIG } from '../lib/conf';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { take, filter, map } from 'rxjs/operators';
import { RsQuagga } from '../Model/qrs';

@Injectable({
  providedIn: 'root'
})
export class BarTwoService {
  processStream: Observable<RsQuagga>;
    detectedCodes: Observable<{ label: string; format: string; }>;
    detecedBoxes: Observable<number[][][]>;
  tar: HTMLElement

  constructor() {
     
  }
  init(tar: HTMLElement) {
    this.tar = tar;
    this.processStream = Quagga
      .decoder({ readers: ['ean_reader', 'code_128_reader'] })
      .fromVideo({
        constraints: { facingMode: "environment" },
        target : tar
      })
      .observe('processed');

    let [drawingCtx,drawingCanvas] =[ Quagga.canvas.ctx.overlay,
         Quagga.canvas.dom.overlay];

    this.detectedCodes = this.processStream.pipe(
      filter((result) => {
        return result && result.codeResult && result.codeResult.code != null;
      }),
      map(result => ({ label: result.codeResult.code, format: result.codeResult.format })
      )
    );

    // create a stream containing all boxes which are detected during scanning
    this.detecedBoxes = this.processStream.pipe(
      filter(result => result.boxes && result.boxes.length > 0),
      map(result => result.boxes));



    //Quagga.init(this.state, function (err) {
    //  if (err) {
    //    console.log(err);
    //    return;
    //  }
    //  Quagga.start();
    //});


  }
  initCameraSelection () {
  var streamLabel = Quagga.CameraAccess.getActiveStreamLabel();

  return Quagga.CameraAccess.enumerateVideoDevices()
    .then(function (devices) {
      function pruneText(text) {
        return text.length > 30 ? text.substr(0, 30) : text;
      }
      var $deviceSelection = document.getElementById("deviceSelection");
      while ($deviceSelection.firstChild) {
        $deviceSelection.removeChild($deviceSelection.firstChild);
      }
      devices.forEach(function (device) {
        var $option = document.createElement("option");
        $option.value = device.deviceId || device.id;
        $option.appendChild(document.createTextNode(pruneText(device.label || device.deviceId || device.id)));
        $option.selected = streamLabel === device.label;
        $deviceSelection.appendChild($option);
      });
    });
}
querySelectedReaders() {
  return Array.prototype.slice.call(document.querySelectorAll('.readers input[type=checkbox]'))
    .filter(function (element) {
      return !!element.checked;
    })
    .map(function (element) {
      return element.getAttribute("name");
    });
  }
  Qustop() {
    Quagga.stop()

  }
  chstate(c,n) {
    let s=this._convertNameToState(n);
    this.setState(s,c)
  }
 
_accessByPath (obj, path, val) {
  var parts = path.split('.'),
    depth = parts.length,
    setter = (typeof val !== "undefined") ? true : false;

  return parts.reduce(function (o, key, i) {
    if (setter && (i + 1) === depth) {
      if (typeof o[key] === "object" && typeof val === "object") {
        Object.assign(o[key], val);
      } else {
        o[key] = val;
      }
    }
    return key in o ? o[key] : {};
  }, obj);
}
_convertNameToState (name) {
  return name.replace("_", ".").split("-").reduce(function (result, value) {
    return result + value.charAt(0).toUpperCase() + value.substring(1);
  });
}
 
setState (path, value) {
  var self = this;

  self._accessByPath(self.state, path, value);
  console.log(JSON.stringify(self.state));
  Quagga.stop();
  this.init(this.tar);
}
inputMapper= {
  inputStream: {
    constraints: function (value) {
      if (/^(\d+)x(\d+)$/.test(value)) {
        var values = value.split('x');
        return {
          width: { min: parseInt(values[0]) },
          height: { min: parseInt(values[1]) }
        };
      }
      return {
        deviceId: value
      };
    }
  },
  numOfWorkers: function (value) {
    return parseInt(value);
  },
  decoder: {
    readers: function (value) {
      if (value === 'ean_extended') {
        return [{
          format: "ean_reader",
          config: {
            supplements: [
              'ean_5_reader', 'ean_2_reader'
            ]
          }
        }];
      }
      console.log("value before format :" + value);
      return [{
        format: value + "_reader",
        config: {}
      }];
    }
  }
}
state = {
  inputStream: {
    type: "LiveStream",
    constraints: {
      width: { min: 640 },
      height: { min: 480 },
      aspectRatio: { min: 1, max: 100 },
      facingMode: "environment" // or user
    }
  },
  locator: {
    patchSize: "large",
    halfSample: true
  },
  numOfWorkers: 4,
  decoder: {
    readers: ["code_39_reader", "code_128_reader"]
  },
  locate: true,
  multiple: true
};
lastResult: null;
  ActionFire() {

    var value;
 
    //value =  App.querySelectedReaders() ;


    Quagga.onProcessed( (result)=> {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
          result.boxes.filter((box)=> {
            return box !== result.box;
          }).forEach(function (box) {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
      }
    });

    Quagga.onDetected( (result)=> {
      var code = result.codeResult.code;

      //if (App.lastResult !== code) {
      //  App.lastResult = code;
      //  var $node = null, canvas = Quagga.canvas.dom.image;

      //  $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
      //  $node.find("img").attr("src", canvas.toDataURL());
      //  $node.find("h4.code").html(code);
      //  $("#result_strip ul.thumbnails").prepend($node);
      //}
    });

  }
}

/// <reference types="node" />
import rx = require("rxjs");
declare namespace G {
  interface foo {

    jj: rx.BehaviorSubject<any>;
  }
}
export =G;

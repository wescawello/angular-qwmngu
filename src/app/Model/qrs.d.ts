export interface StartInfo {
  error: number;
  code: number;
  start: number;
  end: number;
}

export interface DecodedCode {
  code: number;
  start: number;
  end: number;
  error?: number;
}

export interface EndInfo {
  error: number;
  code: number;
  start: number;
  end: number;
}

export interface CodeResult {
  code: string;
  format: string;
  start: number;
  end: number;
  codeset: number;
  startInfo: StartInfo;
  decodedCodes: DecodedCode[];
  endInfo: EndInfo;
  direction: number;
}

export interface Line {
  x: number;
  y: number;
}

export interface RsQuagga {
  codeResult?: CodeResult;
  line: Line[];
  angle: number;
  box: number[][];
  boxes: number[][][];
}

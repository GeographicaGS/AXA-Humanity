import {Injectable} from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

  formatNumber(number, units = '', places = 2, thousand = ',', decimal = '.') {
    const negative = number < 0 ? '-' : '';

    units = ' ' + units;
    units = units === ' ' ? '' : units;

    const i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + '';
    let j = i.length;
    j = j > 3 ? j % 3 : 0;
    const part_1 = negative + (j ? i.substr(0, j) + thousand : '');
    const part_2 = i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand);
    let part_3 = (places ? decimal + Math.abs(number - <any>i).toFixed(places).slice(2) : '');
    if (part_3 === '.00' || part_3 === '.0') {
      part_3 = '';
    }

    let all = part_1 + part_2 + part_3;
    if (thousand === ',' && decimal === '.') {
      // Thousand & decimals were not specified in the signature, let's convert the number to locale
      all = parseFloat(all).toLocaleString();
    }
    return all + units;
  }

  formatNumberToLocale(number, units = '') {
    units = ' ' + units;
    units = units === ' ' ? '' : units;

    return number.toLocaleString() + units;
  }

  webglDetect(returnContext = false) {
    const w = <any>window;
    if (!!w.WebGLRenderingContext) {
      const canvas = document.createElement('canvas'),
            names = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];
      let context: any = false;

      for (let i = 0; i < 4 ; i++) {
        try {
          context = <any>canvas.getContext(names[i]);
          if (context && typeof context.getParameter === 'function') {
            // WebGL is enabled
            if (returnContext) {
              // return WebGL object if the function's argument is present
              return {name: names[i], gl: context};
            }
            // else, return just true
            return true;
          }
        } catch (e) { }
      }
      // WebGL is supported, but disabled
      return false;
    }
    // WebGL not supported
    return false;
  }

}

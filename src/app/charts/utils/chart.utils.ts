import colorLib from '@kurkle/color';

export class ChartUtils {
  public static COLORS = {
    red: 'red',
    blue: 'blue'
  }

  public static transparentize( color: keyof typeof ChartUtils.COLORS, opacity: number = 1 ): string {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return colorLib( color ).alpha( alpha ).rgbString();

  }

}

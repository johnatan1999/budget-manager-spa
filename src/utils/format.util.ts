export default class FormatUtil {

    public static formatCurrency(n: number) {
        return n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }


} 
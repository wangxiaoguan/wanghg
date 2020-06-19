Date.prototype.currentdays= function () {//这个月多少天
    this.setMonth(this.getMonth()+1);
    this.setDate(0);
    return this.getDate();
};

Date.prototype.weekfirstday= function () {//这个月第一天星期几
    this.setDate(1);
    return this.getDay();
};

Date.prototype.prevdays= function () {//上个月多少天
    this.setMonth(this.getMonth());
    this.setDate(0);
    return this.getDate();
};
Date.prototype.dateformat= function (str) {
    return str.replace("yyyy",this.getFullYear()).replace("mm",this.getMonth()+1).replace("dd",this.getDate())
};
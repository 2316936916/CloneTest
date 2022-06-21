// 根据字典表的id查找对应的name，参数一字典表list，参数二传入的num
const findType = (list, num) => {
    let res = '';
    list.map((item) => {
        if (item._id === num || item._id === (`${num}`)) {
            res = item.name;
        }
        return '';
    });
    return res;
};

export {
    findType,
};

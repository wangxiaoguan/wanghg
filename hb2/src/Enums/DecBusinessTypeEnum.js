/**
 * 统一社会代码业务类型枚举
 */
class DecBusinessTypeEnum {
    static NEW = '1';

    static UPDATE = '2';

    static DELETE = '3';

    static OTHER = '4';

    static ALL_LIST = [DecBusinessTypeEnum.NEW, DecBusinessTypeEnum.UPDATE, DecBusinessTypeEnum.DELETE, DecBusinessTypeEnum.OTHER];

    static toString(value) {
        switch (value) {
            case DecBusinessTypeEnum.NEW:
                return '新增';
            case DecBusinessTypeEnum.UPDATE:
                return '变更';
            case DecBusinessTypeEnum.DELETE:
                return '注销';
            case DecBusinessTypeEnum.OTHER:
                return '其他';
            default:
                return '未知';
        }
    }
}

export default DecBusinessTypeEnum;
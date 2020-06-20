import React from 'react';
/***
 * 
 * 审核状态 枚举
 * 
 * 
 */

export const statusEnum = {
    /**
     * 待提交
     */
    TOBESUBMIT : '1',


    /**
     * 待审核
     */
    TOBEREVIEWEB : '2',


    /**
     * 通过
     */

    PSAA : '3',

    /**
     * 
     * 不通过
     */
    FAIL : '4',

    /**
     * 
     * 有更新
     */
    UPDETE : '5',
}

export const statusEnumTostring = (code) => {
    switch (code) {
        case statusEnum.TOBESUBMIT:
            return <span style={{color:'#343434'}}>待提交</span>;
        case statusEnum.TOBEREVIEWEB:
            return <span style={{color:'#999999'}}>待审核</span>;
        case statusEnum.PSAA:
            return <span style={{color:'#20DCB2'}}>已通过</span>;
        case statusEnum.FAIL:
            return <span style={{color:'#FF0000'}}>未通过</span>;
        case statusEnum.UPDETE:
            return <span style={{color:'#343434'}}>有更新</span>;

        default:
            break;
    }

}
import React from 'react';
import ClassStyle from './index.module.scss';
import LeftTools from '../left_tools';
import CenterEdit from '../center_edit';
import RightAction from '../right_action';
import { useState } from 'react'
export default function (props) {
    return <div className={ClassStyle.container} >
        <LeftTools />
        <CenterEdit />
        <RightAction />
    </div>
}
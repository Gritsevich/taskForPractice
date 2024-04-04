import React from "react";
import {Route, Navigate, Routes} from 'react-router-dom'
import { observer } from "mobx-react-lite";
import { MAIN_ROUTE } from "../utils/consts.js";

const AppRouter = observer(() => {
  return (
    <Routes>
      <Route path='*' element={<Navigate to={MAIN_ROUTE} />} />         
    </Routes>
  )
})

export default AppRouter;
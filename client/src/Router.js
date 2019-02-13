import React from "react"
import { BrowserRouter, Route } from "react-router-dom"
import App from "./App"
import SelectSemester from "./SelectSemester"
import CourseSelectionMenu from "./CourseSelectionMenu"
import SelectSemester from "./flow-chart-pages/SelectSemester"
import BasedOnSeq from "./BasedOnSeq"
import BuildSeqOrSem from "./BuildSeqOrSem"
import AndreLink from "./AndreLink"
import RubiatSeqLink from "./RubiatSeqLink"

class Router extends React.Component{
  render(){
    return(
      <BrowserRouter>
        <div>
          <Route exact path="/" component={App} />
          <Route path="/select-semester" component={SelectSemester} />
          <Route path="/course-selection-menu" component={CourseSelectionMenu} />
          <Route path="/build-seq-or-sem" component={BuildSeqOrSem} />
          <Route path="/seq-based-confirmation" component={BasedOnSeq} />
          <Route path="/andre's-App" component={AndreLink} />
          <Route path="/rubiat-seq-table" component={RubiatSeqLink} />
        </div>
      </BrowserRouter>
    )
  }
}

export default Router

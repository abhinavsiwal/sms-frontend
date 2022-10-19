import React, { useState } from 'react'
import "./styles.css"
import SimpleHeader from "components/Headers/SimpleHeader.js";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Container,
  Row,
  Col,
  Label,
  Button,
  CardImg,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
} from "reactstrap";
import DatePicker from "react-datepicker";

function QuestionPaperBuilder() {
  const [step,setStep] = useState(0)
  const nextTab = () =>{
    setStep(1)
  }

  var questionTypes = [
    "Multiple Choice Questions",
    "True / False",
    "Fill in the blanks",
    "Subjective Questions (OR included)",
    "Unseen Passage",
    "Seen Passage",
    "Match the Following"
];

 function getAcademicYear() {
  const year = new Date().getFullYear() + 10;
  const yearsToReturn = [];
  for(let iterator=year;iterator>year-20;iterator--) {
      yearsToReturn.push((iterator-1)+'/'+(iterator%100));
  }
  return yearsToReturn;
}

const questionTypeHandler = (e) =>{
   
}
  return (
    <>
    <SimpleHeader name="Question Paper Builder" parentName="Question" />   
    <Container className="mt--6 shadow-lg" fluid>
      {
        step === 0 &&
        <Card>
          <CardHeader>
            <h2>Question Paper Builder</h2>
          </CardHeader>
          <CardBody>
            <form>

            <Row>
              <Col md="4">
                <label
                  className="form-control-label"
                  htmlFor="exampleFormControlSelect3"
                >
                  Select Class
                </label>
                <Input
                  id="exampleFormControlSelect3"
                  type="select"
                  value={""}
                  required
                >
                  <option value="" disabled selected>
                    Select Class
                  </option>
                  <option>Class A</option>
                  <option>Class B</option>
                  <option>Class I</option>
                  <option>Class II</option>
                  <option>Class III</option>
                  <option>Class IV</option>
                  <option>Class V</option>
                  <option>Class VI</option>
                  <option>Class VII</option>
                  <option>Class VIII</option>
                  <option>Class IX</option>
                  <option>Class X</option>
                </Input>
              </Col>
              <Col md="4">
                <label
                  className="form-control-label"
                  htmlFor="exampleFormControlSelect3"
                >
                  Select Subject
                </label>
                <Input
                  id="exampleFormControlSelect3"
                  type="select"
                  value={""}
                  required
                >
                  <option value="" disabled selected>
                    Select Subject
                  </option>
                  <option>Male</option>
                  <option>Female</option>
                </Input>
              </Col>
              <Col md="4">
                <label
                  className="form-control-label"
                  htmlFor="example4cols2Input"
                >
                  Enter Paper Set
                </label>
                <Input
                  id="example4cols2Input"
                  placeholder="Enter Paper Set"
                  type="text"
                  required
                />
              </Col>
            </Row>
            <Row className='mt-4'>
              <Col md="4">
                <label
                  className="form-control-label"
                  htmlFor="exampleFormControlSelect3"
                >
                  Academic Year
                </label>
                <Input
                  id="exampleFormControlSelect3"
                  type="select"
                  value={""}
                  required
                >
                  <option value="" disabled selected>
                    Select Year
                  </option>
                  {getAcademicYear().map((year,index) => <option key={index} value={year}>{year}</option>)}
                </Input>
              </Col>
              <Col md="4">
                  <Label
                    className="form-control-label"
                    htmlFor="example-date-input"
                  >
                    Exam Date
                  </Label>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    //  value={dateOfBirth}
                    selected={""}
                    required
                    className="datePicker"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
              </Col>
              <Col md="4">
                <label
                  className="form-control-label"
                  htmlFor="example4cols2Input"
                >
                  Start - End Time
                </label>
                <Input
                  id="example4cols2Input"
                  placeholder="Start Time - End Time"
                  type="text"
                  required
                />
              </Col>
            </Row>
            <Row className='mt-3'>
              <Col md="4">
                <label
                  className="form-control-label"
                  htmlFor="example4cols2Input"
                >
                  Total Marks
                </label>
                <Input
                  id="example4cols2Input"
                  placeholder="Total Marks"
                  type="number"
                  required
                />
              </Col>
              <Col>
                  <Button color="primary" className='margin' onClick={nextTab}>
                    Next
                  </Button>
              </Col>
            </Row>
            </form>
          </CardBody>
        </Card>
      }
      {
        step === 1 &&
        <Card>
          <CardBody>
            <form>
            <Row>
              <Col md='5'>
                <label
                  className="form-control-label"
                  htmlFor="exampleFormControlSelect3"
                >
                  Question Type
                </label>
                <Input
                  id="exampleFormControlSelect3"
                  type="select"
                  value={""}
                  required
                  onChange={questionTypeHandler}
                >
                  <option value="" disabled selected>
                    Select Question Type
                  </option>
                  {
                    questionTypes.map((item,index) => (
                      <option key={index} value={item}>{item}</option>
                    ))
                  }
                </Input>
              </Col>
            </Row>
            <Row className='mt-3'>
              <Col md="1">
                <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Q No.
                  </label>
                  <Input
                    id="example4cols2Input"
                    placeholder="1"
                    type="number"
                    required
                  />
              </Col>
              <Col md="8">
                <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Question
                  </label>
                  <Input
                    id="example4cols2Input"
                    placeholder="Enter Question Here"
                    type="text"
                    required
                  />
              </Col>
              <Col md="1">
                <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Choices
                  </label>
                  <Input
                    id="example4cols2Input"
                    placeholder="4"
                    type="number"
                    required
                  />
              </Col>
              <Col md="1">
                <label
                    className="form-control-label"
                    htmlFor="example4cols2Input"
                  >
                    Marks.
                  </label>
                  <Input
                    id="example4cols2Input"
                    placeholder="100"
                    type="number"
                    required
                  />
              </Col>
            </Row>
            <Row>
              <Col md="6">
                  <Button color="primary" className='margin' onClick={nextTab}>
                    Submit
                  </Button>
                  <Button color="danger" className='margin' onClick={nextTab}>
                    Clear
                  </Button>
              </Col>
            </Row>
            </form>
          </CardBody>
        </Card>
      }
    </Container>
    </>
  )
}

export default QuestionPaperBuilder
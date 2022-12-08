import AbstractComponent from '../../../abstract/abstract.component';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './question-paper.component.css';
import UploadAdapter from '../../../shared/upload-adapter';
import { questionTypes } from '../../../shared/constants';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'toast-notification-alert';
import swal from 'sweetalert';
import { isAuthenticated } from "api/auth";
import axios from 'axios';
import {schoolProfile} from "api/school"


const mcqIdentifiers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export default class QuestionPaper extends AbstractComponent {
    constructor() {
        super();
        this.maxChoices = 26;
        this.maxQuestionsForPassage = 100;
        this.questionsContent = {
            [questionTypes[0]]: {
                question: "",
                choices: 0,
                marks: 0,
                choiceLabels: new Array(this.maxChoices).fill("")
            },
            [questionTypes[1]]: {
                question: "",
                marks: 0,
                choiceLabels: ["", ""]
            },
            [questionTypes[2]]: {
                question:"",
                marks: 0
            },
            [questionTypes[3]]:{
                question:"",
                marks: 0,
                doesHasChoice: false,
                choiceQuestion: ""
            },
            [questionTypes[4]]:{
                passage:"",
                marks: 0,
                questionsCount: 0,
                questions: new Array(this.maxQuestionsForPassage).fill("")
            },
            [questionTypes[5]]:{
                passage:"",
                marks: 0,
                questionsCount: 0,
                questions: new Array(this.maxQuestionsForPassage).fill("")
            },
            [questionTypes[6]]:{
                question: "Match the following:",
                marks: 0,
                subQuestionsCount: 0,
                subQuestions: new Array(this.maxChoices).fill(new Array(2).fill(""))
            }
        };

        this.state = {
            classes: [],
            selectedClass: "",
            subject: "",
            paperSet: "",
            part:"",
            sessions:[],
            session: "",
            examDate: "",
            examTime: "",
            totalMarks: "",
            showEditor: false,
            currentQuestion: 1,
            questionType: questionTypes[0],
            ...this.copyObject(this.questionsContent),
            paper: false,
            marksSum: 0,
            schoolName:"",
            schoolAddress:"",
            schoolPhone:"",
            schoolPhoto:""
        };

        this.getAllClasses = this.getAllClasses.bind(this);
        this.getSchoolInfo = this.getSchoolInfo.bind(this);
        this.getInitialContent = this.getInitialContent.bind(this);
        this.handleInitialDetailSubmit = this.handleInitialDetailSubmit.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.clearQuestionForm = this.clearQuestionForm.bind(this);
        this.printQuestionPaper = this.printQuestionPaper.bind(this);
        this.handleSaveQuestionPaper = this.handleSaveQuestionPaper.bind(this);
    }
    
    getInitialContent() {
        if(this.state.paper) {
            return this.state.paper;
        }
        const initialContent = `<table border="1">
            <tr>
                <td colspan="12"'>
                    <img width='20px' height='20px' src=${this.state.schoolPhoto} />
                    <p style="text-align: center;"><b><u>${this.state.schoolName}</u></b></p>
                    <p style="text-align: center;"><b>${this.state.schoolAddress}</b></p>
                    <p style="text-align: center;"><b>${this.state.schoolPhone}</b></p>
                </td>
            </tr>
           <tr>
                <td colspan="6">
                  <p><b>Subject:</b> ${this.state.subject}</p>
                </td>
                <td colspan="6">
                  <p><b>Paper Set:</b> ${this.state.paperSet}</p>
                </td>
           </tr>
           <tr>
                <td colspan="6">
                  <p><b>Maximum Marks:</b> ${this.state.totalMarks}</p>
                </td>
                <td colspan="6">
                  <p><b>Paper Duration:</b> ${this.state.examTime}</p>
                </td>
           </tr>
        </table>
        <p><b>Instructions: </b></p>

        <ol>
            <li>
                Check the exam timetable carefully. Make sure you know the time and locations of your exams. Check whether you should go directly to an exam hall or a waiting room.
            </li>
            <li>
                Lending/borrowing of pen, pencil, ruler, calculator, etc. is strictly prohibited in the examination room. Participant must display UMT ID Card.
            </li>

            <li> No rough work is to be done on the question paper. Participant must mark his/her attendance on the attendance sheet during the examinations.
            </li>

            <li>In case, his/her name is not listed, they need to report to an invigilator immediately.</li>

            <li>
                Any participant using abusive or obscene language in the answer sheet shall be dealt with under disciplinary rules.Participant cannot leave the examination room without prior permission of the invigilator.
            </li>
            <li>
                Do not bring any unauthorised material (e.g. written notes, notes in dictionaries, paper, and sticky tape eraser). Pencil cases and glasses cases must not be taken to your desks. These will be checked and confiscated.
            </li>
            <li>
                Normally, you are required to answer questions using blue or black ink. Make sure you bring some spare pens with you. Do not bring a pencil case.
            </li>
            <li>
                Remember that talking is not allowed at any time in the exam hall.
            </li>
            <li>
                Listen carefully to instructions. Students are required to comply with the instructions of invigilators at all times. For example, if you are asked to sit in a designated place then you must do so and you must not move.
            </li>
            <li>
                Do not turn over exam papers until told to do so.
            </li>
            <li>
                You are not permitted to share calculators or any other materials during the examination.
            </li>
            <li>
                You are not allowed to leave the exam rooms in the first hour and last fifteen minutes. Note that in the case of listening exams, you are not allowed to leave the exam room at any time. If you need to leave an Oral Exam you must ask the Assessor if it is possible.
            </li>
            <li>
                Unless specifically indicated in instructions from the module convenor either on the examination paper itself or in a separate note from the module convenor, no extra pages of any sort will be provided for rough work. You should normally be required to do any rough work in the exam answer books provided and to draw a line through any such work not considered part of your answer.
            </li>
        </ol>
        <b>A participant found guilty of such an act shall be liable to following penalties:</b>
        <ul>
            <li>
                Grade “F” in the subject; and/or
            </li>
            <li>
                Fine up to Rs. 25000; and/or
            </li>
            <li>
                Suspension; and/ or
            </li>
            <li>
                Expulsion from School
            </li>
            <li>
                Any other punishment recommended by the committee.
            </li>
        </ul>
        <ul>
            <p> <strong> Questions </strong></p>
        </ul>
        `;
        return initialContent;
    }

    handleInitialDetailSubmit(event){
        event.preventDefault();
        this.setState({showEditor: true});
    }

    addQuestion(event) {
        event.preventDefault();
        const questionType = this.state.questionType;
        var template;
        switch (questionType) {
            case questionTypes[0]:
                template = `<p>
                    <strong>Q.${this.state.currentQuestion}.&nbsp;&nbsp;&nbsp;&nbsp;${this.state[questionType].question} (${this.state[questionType].marks} Mark${this.state[questionType].marks>1 ? 's' : ''})</strong>
                </p>`;
                this.state[questionType].choiceLabels.forEach((label, index) => {
                    if(index >= this.state[questionType].choices) {
                        return true;
                    }
                    template += `<p>&nbsp;&nbsp;<strong>${mcqIdentifiers[index]}.</strong>&nbsp;&nbsp;&nbsp;&nbsp;${label}</p>`;
                });
                break;
            case questionTypes[1]:
                template = `<p>
                    <strong>Q.${this.state.currentQuestion}.&nbsp;&nbsp;&nbsp;&nbsp;${this.state[questionType].question} (${this.state[questionType].marks} Marks)</strong>
                </p>`;
                this.state[questionType].choiceLabels.forEach((label, index) => {
                    template += `<p>&nbsp;&nbsp;<strong>${mcqIdentifiers[index]}.</strong>&nbsp;&nbsp;&nbsp;&nbsp;${label}</p>`;
                });
                break;
            case questionTypes[2]:
                template = `<p>
                    <strong>Q.${this.state.currentQuestion}.&nbsp;&nbsp;&nbsp;&nbsp;Fill in the Blanks: (${this.state[questionType].marks} Marks)</strong>
                </p>
                <p>${this.state[questionType].question}</p>`;
                break;
            case questionTypes[3]:
                template = `<p>
                    <strong>Q.${this.state.currentQuestion}.&nbsp;&nbsp;&nbsp;&nbsp;${this.state[questionType].question} (${this.state[questionType].marks} Marks)</strong>
                </p>`;
                if(this.state[questionType].doesHasChoice) {
                    template += `<p style="text-align: center;"><strong>OR</strong></p>
                    <p><strong>&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${this.state[questionType].choiceQuestion} (${this.state[questionType].marks} Marks)</strong></p>`;
                }
                break;
            case questionTypes[4]:
                template = `<p>
                    <strong>Q.${this.state.currentQuestion}.&nbsp;&nbsp;&nbsp;&nbsp;Read the following passage: (${this.state[questionType].marks} Marks)</strong>
                </p>
                <p>${this.state[questionType].passage}</p>
                <p><strong>Answer the following questions:</strong></p>`;
                this.state[questionType].questions.forEach((question, index) => {
                    if(index >= this.state[questionType].questionsCount) {
                        return true;
                    }
                    template += `<p>&nbsp;&nbsp;<strong>${index+1}.</strong>&nbsp;&nbsp;&nbsp;&nbsp;<strong>${question}</strong></p>`;
                });
                break;
            case questionTypes[5]:
                template = `<p>
                    <strong>Q.${this.state.currentQuestion}.&nbsp;&nbsp;&nbsp;&nbsp;Read the following (Seen) passage: (${this.state[questionType].marks} Marks)</strong>
                </p>
                <p>${this.state[questionType].passage}</p>
                <p><strong>Answer the following questions:</strong></p>`;
                this.state[questionType].questions.forEach((question, index) => {
                    if(index >= this.state[questionType].questionsCount) {
                        return true;
                    }
                    template += `<p>&nbsp;&nbsp;<strong>${index+1}.</strong>&nbsp;&nbsp;&nbsp;&nbsp;<strong>${question}</strong></p>`;
                });
                break;
            case questionTypes[6]:
                template = `<p>
                    <strong>Q.${this.state.currentQuestion}.&nbsp;&nbsp;&nbsp;&nbsp;${this.state[questionType].question} (${this.state[questionType].marks} Mark${this.state[questionType].marks>1 ? 's' : ''}):</strong>
                </p>`;
                this.state[questionType].subQuestions.forEach((subQuestionSet, index) => {
                    if(index >= this.state[questionType].subQuestionsCount) {
                        return true;
                    }
                    const tabSize = 32;
                    template += `<p>&nbsp;&nbsp;<strong>${index+1}.</strong>&nbsp;&nbsp;&nbsp;&nbsp;${subQuestionSet[0]}
                    ${`&ensp;`.repeat(tabSize - subQuestionSet[0].length)}
                    <strong>${mcqIdentifiers[index]}.</strong>&nbsp;&nbsp;&nbsp;&nbsp;${subQuestionSet[1]}</p>`;
                });
                break;
            default:
                break;
        }
        if(template) {
            this.editor.setData(this.editor.getData()+template);
            this.setState({
              currentQuestion: Number(this.state.currentQuestion)+1,
              marksSum: this.state.marksSum + Number(this.state[questionType].marks)
            });
        }
        this.clearQuestionForm();
    }

    clearQuestionForm() {
        const questionType = this.state.questionType;
        this.setState({
            [questionType]: this.copyObject(this.questionsContent[questionType])
        });
    }

    getAllClasses (){
        var config = {
          method: 'get',
          url: `${process.env.REACT_APP_API_URL}/api/school/class/all/${isAuthenticated().user.school}/${isAuthenticated().user._id}`,
          headers: { 
            'Authorization': 'Bearer ' + isAuthenticated().token
          }
        };
        
        axios(config)
        .then((response) => {
            console.log(response.data)
            this.setState({classes:[...response.data]})
        })
      }

    getSchoolInfo = async () => {
    const res = await schoolProfile(
        isAuthenticated().user.school,
        isAuthenticated().user._id
    );
    this.setState({
        schoolName:res.data.schoolname,
        schoolAddress:res.data.address,
        schoolPhone:res.data.phone,
        schoolPhoto:res.data.photo
    })
    }

    getAllSessions = () =>{
        var config = {
          method: 'get',
          url: `${process.env.REACT_APP_API_URL}/api/school/session/all/${isAuthenticated().user.school}/${isAuthenticated().user._id}`,
          headers: { 
            'Authorization': 'Bearer ' +  isAuthenticated().token
          }
        };
        
        axios(config)
        .then((response) => {
            this.setState({sessions:[...response.data]})
        })
      }

    componentDidMount() {
        this.getAllSessions()
        this.getAllClasses()
        this.getSchoolInfo()
        const questionPaperId = this.props.match && this.props.match.params ?
            this.props.match.params.questionPaperId : null;
        if(questionPaperId) {
            this.toggleLoading(true);
            this.callServerMethod('questionpaper/'+questionPaperId)
            .then(questionPaper => {
                this.toggleLoading(false);
                if (this.isErrorPresent(questionPaper)) {
                    return;
                }
                this.setState({
                    selectedClass: questionPaper.classId,
                    subject: questionPaper.subject,
                    paperSet: questionPaper.paperSet,
                    academicYear: questionPaper.academicYear,
                    examDate: this.setTimeZoneToUTC(new Date(questionPaper.examDate)),
                    examTime: questionPaper.examTime,
                    totalMarks: questionPaper.totalMarks,
                    paper: questionPaper.paper,
                    marksSum: questionPaper.marksSum
                });
            }).catch(err => console.log(err));
        }
    }

    printQuestionPaper() {
        const continuePrinting = () => this.printDocument(
            this.editor.getData(),
            document.getElementsByClassName('ck-content')[0].innerHTML,
            `<style>
                b{
                    text-align:start !important;
                }
                p {
                    font-size: 16px;
                }
                strong{color: black;}
                ol li, ul li {
                    font-size: 18px;
                    color: #000;
                    margin-top: 15px;
                }
                table:first-of-type {
                    width: 100%;
                }
                table:first-of-type td {
                    font-size: 20px;
                }
                table:first-of-type td p{
                    text-align:center
                }
                table:first-of-type img {
                    max-height: 150px;
                }
                table, th, td {
                    border: 1px black solid !important;
                }
                table:first-of-type, table:first-of-type th, table:first-of-type td {
                    border-width: 0 !important;
                }
                table:first-of-type {
                    border-bottom: 1px black solid !important;
                }
                svg {
                    display: none;
                }
                img {
                    width:90px;
                    height:90px;
                }
                ul p{
                    text-align:center;
                }
            </style>`,
            false
        );
        if(this.state.marksSum !== Number(this.state.totalMarks)) {
          swal(`Sum of marks(${this.state.marksSum}) does not match total marks(${this.state.totalMarks}). Do you still want to continue?`, {
            buttons: {
              cancel: "No",
              confirm: {
                text: "Yes",
                value: "confirm"
              }
            },
          })
          .then((value) => {
            if(value){
                continuePrinting()
            }
          });
        } else {
          continuePrinting();
        }
    }

    handleSaveQuestionPaper(event) {
        event.preventDefault();
        const questionPaperRecord = {
            subject: this.state.subject,
            classId: this.state.selectedClass,
            paperSet: this.state.paperSet,
            // examDate: this.setTimeZoneToUTC(this.state.examDate),
            academicYear: this.state.academicYear,
            totalMarks: this.state.totalMarks,
            examTime: this.state.examTime,
            createdById: this.props.userId,
            paper: this.editor.getData(),
            marksSum: this.state.marksSum
        };

        console.log(questionPaperRecord)

        this.toggleLoading(true);
        const questionPaperId = this.props.match && this.props.match.params ?
            this.props.match.params.questionPaperId : null;
        if(!questionPaperId) {
            this.callServerMethod(`grades/update_question/${isAuthenticated().user.school}/${isAuthenticated().user._id}`, 'PUT', {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + isAuthenticated().token
            }, JSON.stringify(questionPaperRecord))
            .then(response => {
                if (this.isErrorPresent(response)) {
                    return;
                }
                if(response.success) {
                    toast.show({ title: response.message,
                        position: 'bottomright', type: 'success' });
                    this.setState({
                        showEditor: false,
                        paper: questionPaperRecord.paper
                    });
                    this.props.history.push('/question-paper/list-view');
                } else {
                    toast.show({ title: response.message,
                        position: 'bottomright', type: 'error' });
                }
            });
        } else {
            questionPaperRecord.id = questionPaperId;
            this.callServerMethod('questionpaper/update', 'POST', {
                'Content-Type': 'application/json'
            }, JSON.stringify(questionPaperRecord))
            .then(response => {
                if (this.isErrorPresent(response)) {
                    return;
                }
                if(response.success) {
                    toast.show({ title: response.message,
                        position: 'bottomright', type: 'success' });
                        this.setState({
                            showEditor: false,
                            paper: questionPaperRecord.paper
                        });
                } else {
                    toast.show({ title: response.message,
                        position: 'bottomright', type: 'error' });
                }
            });
        }
    }

    render() {
        return (
            <div className="question-paper">
                <div className="page">
                    <div className="section-body">
                        <div className="container-fluid">
                            <div className="d-flex justify-content-between align-items-center ">
                                <div className="header-action">
                                    <ol className="breadcrumb page-breadcrumb align-items-center mt-4">
                                      <li className="breadcrumb-item">Question Paper Builder</li>
                                      <li className="breadcrumb-item text-dark">Question Paper</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section-body my-4">
                        <div className="container-fluid">
                            {!this.state.showEditor ?
                                <div className="card">
                                    <form className="card-body" onSubmit={this.handleInitialDetailSubmit}>
                                        <div className="form-group row">
                                            <div className="col-12 col-md-4">
                                                <select className="form-control"
                                                  value={this.state.selectedClass}
                                                  onChange={event => this.handleInputChange(event, 'selectedClass')}
                                                  disabled={this.props.readOnly}>
                                                  <option selected="true" value="" disabled="true">Select Class </option>
                                                  {this.state.classes.map(item => <option value={item._id}>{item.name}</option>)}
                                                </select>
                                            </div>

                                            <div className="col-12 col-md-4">
                                              <select className="form-control"
                                                  value={this.state.subject} 
                                                  onChange={event => this.handleInputChange(event, 'subject')}
                                                  disabled={this.props.readOnly}>
                                                  <option selected="true" value="" disabled="true">Select Section</option>
                                                  <option value={"English"}>English</option>
                                                  
                                              </select>
                                            </div>

                                            <div className="col-12 col-md-4">
                                              <select className="form-control"
                                                  value={this.state.subject} 
                                                  onChange={event => this.handleInputChange(event, 'subject')}
                                                  disabled={this.props.readOnly}>
                                                  <option selected="true" value="" disabled="true">Select Subject</option>
                                                  <option value={"English"}>English</option>
                                                  
                                              </select>
                                            </div>

                                            <div className="mt-3 col-12"></div>

                                            <div className="col-12 col-md-4">
                                                <input type="text" placeholder="Enter Paper Set"
                                                    className="form-control" value={this.state.paperSet}
                                                    onChange={event => this.handleInputChange(event, 'paperSet')}
                                                    disabled={this.props.readOnly} />
                                            </div>

                                            <div className="col-12 col-md-4">
                                                <DatePicker name="startDate" selected={this.state.examDate}
                                                    onChange={(event) => this.handleInputChange(event, 'examDate', 'date')}
                                                    className="form-control" placeholderText="Exam Date" 
                                                    dateFormat="dd/MM/yyyy" minDate={new Date()}
                                                    readOnly={this.props.readOnly} />
                                            </div>

                                            <div className="col-12 col-md-4">
                                                <input className="form-control" placeholder="Total Marks"
                                                     value={this.state.totalMarks}
                                                    disabled={this.props.readOnly}
                                                    onChange={event => this.handleInputChange(event, 'totalMarks', 'number', 100)} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-4">
                                              <select className="form-control"
                                                  value={this.state.academicYear}
                                                  onChange={event => this.handleInputChange(event, 'session')}
                                                  disabled={this.props.readOnly}>
                                                  <option selected="true" value="" disabled="true">Academic Year</option>
                                                  {this.state.sessions.map(item => <option value={item._id}>{item.name}</option>)}
                                              </select>
                                            </div>
                                            <div className="col-4">
                                                <button type='submit' className="btn btn-primary">Next {'>>'}</button>
                                            </div>
                                        </div>
                                    </form>
                                </div> :
                                <>
                                    {!this.props.readOnly ?
                                    <div className="card px-md-4">
                                        <div className="card-body px-md-4">
                                            <div className="row form-group">
                                                <div className='col-6'>
                                                    <label className=" font-weight-bold">
                                                        Question Type
                                                    </label>
                                                    <div className="">
                                                        <select className="form-control" required="true"
                                                            value={this.state.questionType}
                                                            onChange={event => this.handleInputChange(event, 'questionType')}>
                                                            {questionTypes.map(type => <option value={type}>{type}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='col-6'>
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            <label className="font-weight-bold">
                                                                Question Part
                                                            </label>
                                                            <div className="">
                                                                <input type="text" placeholder="Enter Question Part"
                                                                className="form-control" value={this.state.part}
                                                                onChange={event => this.handleInputChange(event, 'part')}
                                                                disabled={this.props.readOnly} />
                                                            </div>
                                                        </div>
                                                        <div className='col-6 d-flex align-items-end'>
                                                            <button className="btn btn-primary"><i className="fa fa-check" />&nbsp;&nbsp;Submit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <form onSubmit={this.addQuestion}>
                                            {this.state.questionType === questionTypes[0] ?
                                            <>
                                                <div className="row">
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Q.No.</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state.currentQuestion}
                                                            onChange={event => this.handleInputChange(event, 'currentQuestion', 'number')} />
                                                    </div>
                                                    <div className="col-9">
                                                        <label className="font-weight-bold">Question</label>
                                                        <textarea style={{resize:"none",height:"46px"}} required placeholder="Enter Question Here" className="form-control"
                                                            resizable='none' value={this.state[questionTypes[0]].question}
                                                            onChange={event => this.handleInputChange(event, questionTypes[0]+'.question')}>
                                                        </textarea>
                                                    </div>
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Choices</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state[questionTypes[0]].choices}
                                                            onChange={event => this.handleInputChange(event, questionTypes[0]+'.choices', 'number', this.maxChoices)} />
                                                    </div>
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Marks</label>
                                                        <input className="form-control"
                                                            value={this.state[questionTypes[0]].marks}
                                                            onChange={event => this.handleInputChange(event, questionTypes[0]+'.marks', 'number', Number(this.state.totalMarks-this.state.marksSum))} />
                                                    </div>
                                                    {this.state[questionTypes[0]].choiceLabels.map((choice, index) => {
                                                        if(index >= this.state[questionTypes[0]].choices) {
                                                            return null;
                                                        }
                                                        return (
                                                            <div className="col-12 col-md-6 mt-2">
                                                                <label className="font-weight-bold">Choice {index+1}</label>
                                                                <input className="form-control" required="true" value={choice}
                                                                    placeholder="Enter choice text here"
                                                                    onChange={event => this.handleInputChange(event, questionTypes[0]+'.choiceLabels.'+index)} />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>: null}

                                            {this.state.questionType === questionTypes[1] ?
                                            <>
                                                <div className="row">
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Q.No.</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state.currentQuestion}
                                                            onChange={event => this.handleInputChange(event, 'currentQuestion', 'number')} />
                                                    </div>
                                                    <div className="col-10">
                                                        <label className="font-weight-bold">Question</label>
                                                        <textarea style={{resize:"none",height:"46px"}} required placeholder="Enter Question Here" className="form-control"
                                                            resizable={false} value={this.state[questionTypes[1]].question}
                                                            onChange={event => this.handleInputChange(event, questionTypes[1]+'.question')}>
                                                        </textarea>
                                                    </div>
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Marks</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state[questionTypes[1]].marks}
                                                            onChange={event => this.handleInputChange(event, questionTypes[1]+'.marks', 'number', Number(this.state.totalMarks-this.state.marksSum))} />
                                                    </div>
                                                    {this.state[questionTypes[1]].choiceLabels.map((choice, index) => {
                                                        return (
                                                            <div className="col-12 col-md-6 mt-2">
                                                                <label className="font-weight-bold">For {!index ? "True" : "False"}</label>
                                                                <input className="form-control" required="true" value={choice}
                                                                    placeholder="Enter choice text here"
                                                                    onChange={event => this.handleInputChange(event, questionTypes[1]+'.choiceLabels.'+index)} />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </> : null}

                                            {this.state.questionType === questionTypes[2] ?
                                            <>
                                                <div className="row">
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Q.No.</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state.currentQuestion}
                                                            onChange={event => this.handleInputChange(event, 'currentQuestion', 'number')} />
                                                    </div>
                                                    <div className="col-10">
                                                        <label className="font-weight-bold">Question</label>
                                                        <textarea style={{resize:"none",height:"46px"}} required placeholder="Enter Question Here" className="form-control"
                                                            resizable={false} value={this.state[questionTypes[2]].question}
                                                            onChange={event => this.handleInputChange(event, questionTypes[2]+'.question')}>
                                                        </textarea>
                                                    </div>
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Marks</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state[questionTypes[2]].marks}
                                                            onChange={event => this.handleInputChange(event, questionTypes[2]+'.marks', 'number', Number(this.state.totalMarks-this.state.marksSum))} />
                                                    </div>
                                                </div>
                                            </> : null}

                                            {this.state.questionType === questionTypes[3] ?
                                            <>
                                                <div className="row">
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Q.No.</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state.currentQuestion}
                                                            onChange={event => this.handleInputChange(event, 'currentQuestion', 'number')} />
                                                    </div>
                                                    <div className="col-10">
                                                        <label className="font-weight-bold">Question</label>
                                                        <textarea style={{resize:"none",height:"46px"}} required placeholder="Enter Question Here" className="form-control"
                                                            resizable={false} value={this.state[questionTypes[3]].question}
                                                            onChange={event => this.handleInputChange(event, questionTypes[3]+'.question')}>
                                                        </textarea>
                                                    </div>
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Marks</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state[questionTypes[3]].marks}
                                                            onChange={event => this.handleInputChange(event, questionTypes[3]+'.marks', 'number', Number(this.state.totalMarks-this.state.marksSum))} />
                                                    </div>
                                                    <div className="col-12 custom-control custom-checkbox my-2 ml-4">
                                                        <input type="checkbox" className="custom-control-input" id="does-has-choice"
                                                            checked={this.state[questionTypes[3]].doesHasChoice} style={{cursor: 'pointer', zIndex: 10}}
                                                            onChange={event => this.handleInputChange({target: {value: event.target.checked}}, questionTypes[3]+'.doesHasChoice')} />
                                                        <label className="custom-control-label" for="does-has-choice" style={{cursor: 'pointer', zIndex: 10}}>
                                                            Does this question has choice?
                                                        </label>
                                                    </div>
                                                    {this.state[questionTypes[3]].doesHasChoice ?
                                                    <div className="col-12 row">
                                                        <label className="font-weight-bold col-2">(OR) Question</label>
                                                        <textarea style={{resize:"none",height:"46px"}} required placeholder="Enter Question Here" className="form-control col"
                                                            resizable={false} value={this.state[questionTypes[3]].choiceQuestion}
                                                            onChange={event => this.handleInputChange(event, questionTypes[3]+'.choiceQuestion')}>
                                                        </textarea>
                                                    </div> : null}
                                                </div>
                                            </> : null}

                                            {this.state.questionType === questionTypes[4] ?
                                            <>
                                                <div className="row">
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Q.No.</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state.currentQuestion}
                                                            onChange={event => this.handleInputChange(event, 'currentQuestion', 'number')} />
                                                    </div>
                                                    <div className="col-9">
                                                        <label className="font-weight-bold">Question</label>
                                                        <textarea style={{resize:"none",height:"46px"}} required placeholder="Enter Passage Here" className="form-control"
                                                            resizable={false} value={this.state[questionTypes[4]].passage} rows="10"
                                                            onChange={event => this.handleInputChange(event, questionTypes[4]+'.passage')}>
                                                        </textarea>
                                                    </div>
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Questions</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state[questionTypes[4]].questionsCount}
                                                            onChange={event => this.handleInputChange(event, questionTypes[4]+'.questionsCount', 'number', this.maxQuestionsForPassage)} />
                                                    </div>
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Marks</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state[questionTypes[4]].marks}
                                                            onChange={event => this.handleInputChange(event, questionTypes[4]+'.marks', 'number', Number(this.state.totalMarks-this.state.marksSum))} />
                                                    </div>
                                                    {this.state[questionTypes[4]].questions.map((question, index) => {
                                                        if(index >= this.state[questionTypes[4]].questionsCount) {
                                                            return null;
                                                        }
                                                        return (
                                                            <div className="col-12">
                                                                <label className="font-weight-bold">Question No. {index+1}</label>
                                                                <textarea style={{resize:"none",height:"46px"}} className="form-control" required="true" value={question}
                                                                    placeholder="Enter Question here"
                                                                    onChange={event => this.handleInputChange(event, questionTypes[4]+'.questions.'+index)} />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </> : null}
                                            {this.state.questionType === questionTypes[5] ?
                                            <>
                                                <div className="row">
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Q.No.</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state.currentQuestion}
                                                            onChange={event => this.handleInputChange(event, 'currentQuestion', 'number')} />
                                                    </div>
                                                    <div className="col-9">
                                                        <label className="font-weight-bold">Question</label>
                                                        <textarea required placeholder="Enter Passage Here" className="form-control"
                                                            resizable={false} value={this.state[questionTypes[5]].passage} rows="10"
                                                            onChange={event => this.handleInputChange(event, questionTypes[5]+'.passage')}>
                                                        </textarea>
                                                    </div>
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Questions</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state[questionTypes[5]].questionsCount}
                                                            onChange={event => this.handleInputChange(event, questionTypes[5]+'.questionsCount', 'number', this.maxQuestionsForPassage)} />
                                                    </div>
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Marks</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state[questionTypes[5]].marks}
                                                            onChange={event => this.handleInputChange(event, questionTypes[5]+'.marks', 'number', Number(this.state.totalMarks-this.state.marksSum))} />
                                                    </div>
                                                    {this.state[questionTypes[5]].questions.map((question, index) => {
                                                        if(index >= this.state[questionTypes[5]].questionsCount) {
                                                            return null;
                                                        }
                                                        return (
                                                            <div className="col-12">
                                                                <label className="font-weight-bold">Question No. {index+1}</label>
                                                                <textarea style={{resize:"none",height:"46px"}} className="form-control" required="true" value={question}
                                                                    placeholder="Enter Question here"
                                                                    onChange={event => this.handleInputChange(event, questionTypes[5]+'.questions.'+index)} />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </> : null}
                                            {this.state.questionType === questionTypes[6] ?
                                            <>
                                                <div className="row">
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Q.No.</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state.currentQuestion}
                                                            onChange={event => this.handleInputChange(event, 'currentQuestion', 'number')} />
                                                    </div>
                                                    <div className="col-9">
                                                        <label className="font-weight-bold">Question</label>
                                                        <textarea style={{resize:"none",height:"46px"}} required placeholder="Enter Question Here" className="form-control"
                                                            resizable={false} value={this.state[questionTypes[6]].question}
                                                            onChange={event => this.handleInputChange(event, questionTypes[6]+'.question')}>
                                                        </textarea>
                                                    </div>
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Choices</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state[questionTypes[6]].subQuestionsCount}
                                                            onChange={event => this.handleInputChange(event, questionTypes[6]+'.subQuestionsCount', 'number', this.maxChoices)} />
                                                    </div>
                                                    <div className="col-1">
                                                        <label className="font-weight-bold">Marks</label>
                                                        <input className="form-control" required="true"
                                                            value={this.state[questionTypes[6]].marks}
                                                            onChange={event => this.handleInputChange(event, questionTypes[6]+'.marks', 'number', Number(this.state.totalMarks))} />
                                                    </div>
                                                    {this.state[questionTypes[6]].subQuestions.map((subQuestionSet, index) => {
                                                        if(index >= this.state[questionTypes[6]].subQuestionsCount) {
                                                            return null;
                                                        }
                                                        return (
                                                            <div className="col-12 row mt-2">
                                                                <div className="col-6 mt-2 row">
                                                                    <label className="font-weight-bold col-auto">{index+1}.</label>
                                                                    <input className="form-control col" required="true" value={subQuestionSet[0]}
                                                                        placeholder="Enter option here"
                                                                        onChange={event => this.handleInputChange(event, questionTypes[6]+'.subQuestions.'+index+'.0')} />
                                                                </div>
                                                                <div className="col-6 mt-2 row">
                                                                    <label className="font-weight-bold col-auto">{mcqIdentifiers[index]}.</label>
                                                                    <input className="form-control col" required="true" value={subQuestionSet[1]}
                                                                        placeholder="Enter option here"
                                                                        onChange={event => this.handleInputChange(event, questionTypes[6]+'.subQuestions.'+index+'.1')} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>: null}
                                                <div className="mt-3 ml-1 row btn-group">
                                                    <button className="btn btn-primary col-auto"><i className="fa fa-check" />&nbsp;&nbsp;Submit</button>
                                                    <button type="button" className="btn btn-secondary col-auto" onClick={this.clearQuestionForm}>
                                                        <i className="fa fa-times" />&nbsp;&nbsp;Clear
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    : null}
                                    <div className="btn-group">
                                        {!this.props.readOnly ?
                                            <button className="btn btn-primary" onClick={this.handleSaveQuestionPaper}><i className="fa fa-save" />&nbsp;&nbsp;Save</button>
                                        : null}
                                        <button className="btn btn-dark" onClick={this.printQuestionPaper}><i className="fa fa-print" />&nbsp;&nbsp;Print</button>
                                    </div>
                                    <div className="document-editor">
                                        <CKEditor
                                            onReady={ editor => {
                                                editor.ui.getEditableElement().parentElement.insertBefore(
                                                    editor.ui.view.toolbar.element,
                                                    editor.ui.getEditableElement()
                                                );
                                                editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
                                                    return new UploadAdapter( loader );
                                                };
                                                editor.config.allowedContent = true;
                                                editor.setData(this.getInitialContent());
                                                this.editor = editor;
                                            } }
                                            onError={ ( { willEditorRestart } ) => {
                                                if ( willEditorRestart ) {
                                                    this.editor.ui.view.toolbar.element.remove();
                                                }
                                            } }
                                            editor={ ClassicEditor }
                                            config={{
                                                allowedContent: true,
                                                readOnly: this.props.readOnly
                                            }}
                                        />
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

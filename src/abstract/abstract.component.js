import React from 'react';
import { toast } from 'toast-notification-alert';
import Excel from 'excel4node';
class AbstractComponent extends React.Component {
    constructor() {
        super();
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStudentSearch = this.handleStudentSearch.bind(this);
        this.handleInputChangeWithRegex = this.handleInputChangeWithRegex.bind(this);

        this.mobileRegexOptional = "^(\\+91 )(|[0-9]{10})$";
        this.mobileRegex = "^(\\+91 )[0-9]{10}$";
        this.mobileRegexForInput = /^(\+91 )[0-9]{0,10}$/;
        this.telephoneNumberForInput = /^(\+|\+9|\+91|\+91 ){0,1}(\d*( )*)*$/;
        this.emailRegex = "^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
    }

    toggleLoading(showLoading) {
        if(showLoading) {
            Array.prototype.forEach.call(document.getElementsByClassName("page-loader-wrapper-react"), load => load.style.display = "block");
        } else {
            Array.prototype.forEach.call(document.getElementsByClassName("page-loader-wrapper-react"), load => load.style.display = "none");
        }
    }

    handleInputChange(event, name, type=false, max=null, manualFocus=null) {
        let originalValue;
        if(type === 'date') {
            originalValue = event;
        } else {
            originalValue = event.target.value;
            if(type === 'number' && (isNaN(Number(originalValue)) || Number(originalValue) < 0)) {
                return;
            }
            if(type === 'number' && max != null && Number(originalValue) > max) {
                return;
            }
        }

        const attributes = name.split('.');
        if(attributes.length <= 1) {
            this.setState({[name]: originalValue});
            return;
        }
        const key = attributes[0];
        const value = this.state[key];
        let prevObj = value;
        for(let i=1;i<attributes.length;i++) {
            if(i+1 === attributes.length) {
                prevObj[attributes[i]] = (type === 'date' ? event : event.target.value);
            } else {
                prevObj = prevObj[attributes[i]];
            }
        }
        this.setState({[key]: value}, () => {
            if(manualFocus) {
                document.getElementById(event.target.id).focus();
            }
        });
    }

    copyObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

    scrollTop() {
        var html = document.documentElement;
        html.scrollTop = 0;
    }

    handleStudentSearch(event, listName, endPoint='student/search') {
        if(event) {
            event.preventDefault();
        }
        this.setState({
          isStudentsLoading: true,
          [listName]: []
        });
        this.callServerMethod(endPoint, 'POST', {
          'Content-Type': 'application/json'
        }, JSON.stringify(this.state[listName+'SearchParam']))
        .then(students => {
            if(this.isErrorPresent(students)) {
                return;
            }
            if(endPoint === 'result/summary' && this.state.studentsSearchParam) {
                students.forEach((result, index) => {
                    students[index].student.classId = this.state.studentsSearchParam.classId;
                    students[index].student.sectionId = this.state.studentsSearchParam.classSection;
                });
            }
          this.setState({
            isStudentsLoading: false,
            [listName]: students
          });
        });
    }

    printDocument(divId, ck,cssstring='', idPassed=true) {
        console.log(cssstring)
        const header = `<!doctype html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="icon" href="favicon.ico" type="image/x-icon"/>
        <title></title>

        <!-- Bootstrap Core and vandor -->
        <link rel="stylesheet" href="/assets/plugins/bootstrap/css/bootstrap.min.css" />

        <!-- Core css -->
        <link rel="stylesheet" href="/assets/css/style.min.css"/>
        <link rel="stylesheet" href="/assets/css/styles.css" />
        ${cssstring}
        </head>

        <body className="font-muli theme-cyan gradient">`
        const footer = `<!-- Start Main project js, jQuery, Bootstrap -->
        <script src="../assets/bundles/lib.vendor.bundle.js"></script>

        <!-- Start Plugin Js -->
        <script src="../assets/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js"></script>
        <script src="../assets/bundles/dataTables.bundle.js"></script>
        <script src="../assets/plugins/sweetalert/sweetalert.min.js"></script>

        <!-- Start project main js  and page js -->
        <script src="../assets/js/core.js"></script>
        <script src="../assets/js/table/datatable.js"></script>
        </body>
        </html>`;
        let ifram = document.createElement("iframe");
        ifram.style = "display:none";
        document.body.appendChild(ifram);
        const pri = ifram.contentWindow;
        pri.document.open();
        const content = header + (idPassed ? document.getElementById(divId).innerHTML : divId)+footer;
        // const doc = new jsPDF('l', 'pt', 'a4');
        pri.document.write(content);

        // const specialElementHandlers = {
        //     // element with id of "bypass" - jQuery style selector
        //     'div': function(element, renderer){
        //         // true = "handled elsewhere, bypass text extraction"
        //         return true
        //     }
        // }
        // doc.html(document.getElementById(divId), {
        //     'width': 1000 // max width of content on PDF
        //      ,'elementHandlers': specialElementHandlers
        // }).then((res) => {
        //     const files = new FormData();
        //     files.append('doc', doc);
        //     this.callServerMethod('fileupload', 'POST', null, files)
        //     .then(res => console.log(res))
        //     .catch(err => console.log(err));
        // });

        pri.document.close();
        pri.focus();
        pri.onload = function(){
            pri.print();
        }
    }

    // formatDate(date = null) {
    //     var d = date ? new Date(date) : new Date(),
    //         month = '' + (d.getMonth() + 1),
    //         day = '' + d.getDate(),
    //         year = d.getFullYear();

    //     if (month.length < 2)
    //         month = '0' + month;
    //     if (day.length < 2)
    //         day = '0' + day;

    //     return [day, month, year].join('/');
    // }

    isErrorPresent(payload) {
        this.toggleLoading(false);
        if(payload.Message) {
            toast.show({title: payload.Message, position: 'bottomright', type: 'error'});
            return true;
        }
        return false;
    }

    // setTimeZoneToUTC(date) {
    //     return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),date.getHours(),date.getMinutes()));
    // }

    handleInputChangeWithRegex(event, name, regex, max=null, manualFocus=null) {
        if(regex.test(event.target.value)) {
            this.handleInputChange(event, name, max != null ? 'number' : false, max != null ? Number(max) : null, manualFocus);
        }
    }

    exportExcelSheet(nameOfFile, data, columns) {
        const workbook = new Excel.Workbook();
        const sheet = workbook.addWorksheet('Sheet 1');
        const bold=workbook.createStyle({
            font:{bold:true}
        });
        const boldAndCenter=workbook.createStyle({
            font:{bold:true},
            alignment: {horizontal: 'center'}
        });
        sheet.cell(1, 1, 1, columns.length, true).string(this.props.schoolInfo.name).style(boldAndCenter);
        sheet.cell(2, 1, 2, columns.length, true).string(nameOfFile).style(boldAndCenter);
        const addRows = 2;
        columns.forEach(({name}, index) => {
            sheet.cell(1+addRows, index+1).string(name).style(bold);
        });

        data.forEach((record, index1) => {
            columns.forEach(({selector, cell, cell2}, index2) => {
                let content = '';
                if(selector) {
                    const path = selector.split(".");
                    let val = record;
                    path.forEach(index => {
                        val = val[index];
                    });
                    content = ''+val;
                } else if(cell2) {
                    content = ''+cell2(record, index1);
                } else {
                    content = ''+cell(record, index1);
                }
                sheet.cell(index1+2+addRows, index2+1).string(content);
            });
        });

        workbook.writeToBuffer().then(file => {
            this.saveByteArray(nameOfFile+'.xlsx', file);
        });
    }

     saveByteArray(fileName, byte) {
        var blob = new Blob([byte], {type: "application/pdf"});
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    };
}

export default AbstractComponent;

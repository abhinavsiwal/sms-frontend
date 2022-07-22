import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    background:
      "url(https://images.unsplash.com/photo-1587987501183-33e43fdde781?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1484&q=80) no-repeat fixed center",
    top: "90px",
    left: "160px",
    bottom: 0,
    right: 0,
    position: "absolute",
    zIndex: -1,
    opacity: 0.2,
    width: "200px",
    height:"200px",

  },
  section: {
    width: "90vw",
    // height: "72vh",
    border: "4px solid black",
    display: "flex",
    flexDirection: "column",
  },
  companyName: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    borderBottom: "4px solid black",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameLogo: {
    width: "70px",
    height: "70px",
  },
  companyNameText: {},
  companyAddress: {
    fontSize: "12px",
    color: "black",
    textAlign: "center",
    borderBottom: "4px solid black",
    padding: "5px",
  },
  companyAddressText: {},
  salaryMonth: {
    fontSize: "12px",
    color: "black",
    textAlign: "center",
    borderBottom: "4px solid black",
  },
  employeeDetails: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    fontSize: "14px",
    borderBottom: "2px solid black",
  },
  div1: {
    width: "50%",

    borderRight: "4px solid black",
    display: "flex",
    flexDirection: "column",
    padding: "4px",
  },
  inside: {
    display: "flex",
    flexDirection: "row",
    width: "100%",

    justifyContent: "space-between",
  },
  insideText1: {
    // margin: "2px",
    fontWeight: "600",
  },
  insideText2: {
    // margin: "2px",
  },
  div2: {
    width: "50%",
    height: "100%",

    display: "flex",
    flexDirection: "column",
    padding: "4px",
  },
  leaves: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    fontWeight: "bold",
    borderBottom: "2px solid black",
    padding: "2px",
  },
  leaveText: {
    fontSize: "12px",
    color: "black",
    textAlign: "center",
  },
  salaryMain: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    fontSize: "14px",
  },
  additions: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    borderRight: "4px solid black",

    padding: "4px",
  },
  deductions: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    padding: "4px",
  },
  empty: {
    paddingTop: "15px",
    borderBottom: "2px solid black",
  },
  first: {
    borderBottom: "2px solid black",
    justifyContent: "center",
    display: "flex",
    fontSize: "12px",
    fontWeight: "bold",
    textAlign: "center",
    padding: "2px",
  },
});
const SalarySlip = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
    
        <View style={styles.section}>
        <Image
              src="https://images.unsplash.com/photo-1587987501183-33e43fdde781?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1484&q=80"
              style={styles.background}
            />
          <View style={styles.companyName}>
            <Image
              src="https://images.unsplash.com/photo-1587987501183-33e43fdde781?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1484&q=80"
              style={styles.nameLogo}
            />
            <Text style={styles.companyNameText}>XXXXXX Pvt. Ltd .</Text>
            <View />
          </View>
          <View style={styles.companyAddress}>
            <Text style={styles.companyAddressText}>
              100/F, Profit Center, Near Mahavir Nagar, <br /> Kandivali West,
              Mumbai, 400067
            </Text>
          </View>
          <View style={styles.salaryMonth}>
            <Text> SALARY SLIP FOR THE MONTH : September-2020</Text>
          </View>
          <View style={styles.employeeDetails}>
            <View style={styles.div1}>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>EMPLOYEE NAME:</Text>
                <Text style={styles.insideTex2}>Abhinav</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>FATHER'S NAME:</Text>
                <Text style={styles.insideTex2}>Karamvir Singh</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>DESIGNATION:</Text>
                <Text style={styles.insideTex2}>Software Engineer</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>BANK NAME:</Text>
                <Text style={styles.insideTex2}>SBI</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>PAN NO:</Text>
                <Text style={styles.insideTex2}>ADSE23432A</Text>
              </View>
            </View>
            <View style={styles.div2}>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>EMPLOYEE CODE:</Text>
                <Text style={styles.insideTex2}>06</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>DATE OF JOINING:</Text>
                <Text style={styles.insideTex2}>01-Apr-2001</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>DEPARTMENT:</Text>
                <Text style={styles.insideTex2}>IT</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>PAY MODE:</Text>
                <Text style={styles.insideTex2}>A/C TRN</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>A/C NO:</Text>
                <Text style={styles.insideTex2}>792347923739999</Text>
              </View>
            </View>
          </View>
          <View style={styles.leaves}>
            <Text style={styles.leaveText}>MONTH DAYS : 30</Text>
            <Text style={styles.leaveText}>LOP DAYS : 0</Text>
            <Text style={styles.leaveText}>PAY DAYS : 30</Text>
          </View>
          <View style={styles.salaryMain}>
            <View style={styles.additions}>
              <View style={[styles.empty, styles.inside]}></View>
              <View style={styles.inside}>
                <Text style={styles.insideText2}>BASIC SALARY:</Text>
                <Text style={styles.insideTex2}>Rs 20,000</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText2}>
                  Leave Travel Allowance (LTA):
                </Text>
                <Text style={styles.insideTex2}>Rs. 1,000</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText2}>
                  House Rent Allowance (HRA):
                </Text>
                <Text style={styles.insideTex2}>Rs. 0</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>GROSS SALARY:</Text>
                <Text style={styles.insideTex2}>Rs. 21,000</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>TOTAL EARNINGS:</Text>
                <Text style={styles.insideTex2}>Rs. 21,000</Text>
              </View>
            </View>
            <View style={styles.deductions}>
              <View style={[styles.first, styles.inside]}>
                <Text style={styles.insideText2}>DEDUCTIONS</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText2}>PROFESSIONAL TAX:</Text>
                <Text style={styles.insideTex2}>Rs. 200</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText2}>INCOME TAX:</Text>
                <Text style={styles.insideTex2}>Rs. 200</Text>
              </View>

              <View style={styles.inside}>
                <Text style={styles.insideText1}>OTHER:</Text>
                <Text style={styles.insideTex2}>Rs. 0</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>TOTAL DEDUCTIONS:</Text>
                <Text style={styles.insideTex2}>Rs. 200</Text>
              </View>
              <View style={styles.inside}>
                <Text style={styles.insideText1}>NET SALARY:</Text>
                <Text style={styles.insideTex2}>Rs. 20800</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default SalarySlip;

const reportRouter = require('express').Router();
const ExcelJS = require('exceljs');
const {db_Select} = require('../modules/MasterModule');
reportRouter.use((req, res, next) => {
    var user = req.session.user;
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
});

   ///  *************  Code for Society Election Result    ****   ////

  reportRouter.get('/election_due_req', async(req, res) => {
    try {
        // Extract range_id from session
        const range_id = req.session.user.range_id;
        var range_code = range_id;
        var title = 'Election Due';
        const ranzeres = await db_Select('*', 'md_range',`range_id=${range_code}`, null);
        if(range_code > 0){
          range_name = ranzeres.msg[0].range_name;
        }else{
          range_name =  'ALL Range';
        }
        const rangeres = await db_Select('*', 'md_range',null, null);
        const soctyperes = await db_Select('*', 'md_society_type',null, null);
        // Prepare data for rendering
        const res_dt = {
          range_list : rangeres.suc > 0 ? rangeres.msg : '',
          socty_list : soctyperes.suc > 0 ? soctyperes.msg : '',
          page: 1,range_name:range_name,
          socname:'',title:title,soc_data_status:''
        };
        // Render the view with data
        res.render('report/election_status_input', res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        res.render('report/election_status_input', res_dt);
      }
  })
  reportRouter.post('/election_due', async(req, res) => {
    try {
        // Extract range_id from session
        var postdata = req.body;
        const range_id = req.session.user.range_id;
        var range_code = postdata.range_id;
        var title = 'Election Due';
        const select = "a.id,a.cop_soc_name,a.last_elec_date,a.tenure_ends_on,a.elec_due_date,a.reg_no,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
        if(range_id > 0){ 
          var select_type = postdata.soc_type > 0 ? `AND a.range_code = '${postdata.soc_type}'` : '' ;
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' ${select_type} AND a.tenure_ends_on < CURDATE() AND a.range_code = "${range_id}" `;
        }else{
          var select_range = range_code > 0 ? `AND a.range_code = '${range_code}'` : '' ;
          var select_type = postdata.soc_type > 0 ? `AND a.range_code = '${postdata.soc_type}'` : '' ;
          var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' ${select_range+select_type} AND a.tenure_ends_on < CURDATE() `;
        }
        // Execute database query
        const result = await db_Select(select, table_name, null, null);
        const ranzeres = await db_Select('*', 'md_range',`range_id=${range_code}`, null);
      // console.log(ranzeres);
        if(range_code > 0){
          range_name = ranzeres.msg[0].range_name;
        }else{
          range_name =  'ALL Range';
        }
        // Prepare data for rendering
        const res_dt = {
          data: result.suc > 0 ? result.msg : '',
          page: 1,range:postdata.range_id,soc_type:postdata.soc_type,range_name:range_name,
          socname:'',title:title,soc_data_status:''
        };
        // Render the view with data
        res.render('report/election_result', res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
        res.render('report/election_result', res_dt);
      }
  })

  reportRouter.get('/election_upcoming_req', async(req, res) => {
    try {
        // Extract range_id from session
        const range_id = req.session.user.range_id;
        
        var range_code = range_id;
        var title = 'Election Upcoming';
        const ranzeres = await db_Select('*', 'md_range',`range_id=${range_code}`, null);
        if(range_code > 0){
          range_name = ranzeres.msg[0].range_name;
        }else{
          range_name =  'ALL Range';
        }
        const rangeres = await db_Select('*', 'md_range',null, null);
        const soctyperes = await db_Select('*', 'md_society_type',null, null);
        // Prepare data for rendering
        const res_dt = {
          range_list : rangeres.suc > 0 ? rangeres.msg : '',
          socty_list : soctyperes.suc > 0 ? soctyperes.msg : '',
          page: 1,range_name:range_name,
          socname:'',title:title,soc_data_status:''
        };
        // Render the view with data
        res.render('report/election_upcoming_input', res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        res.render('report/election_upcoming_input', res_dt);
      }
  })
  reportRouter.post('/election_upcoming', async(req, res) => {
    try {
        // Extract range_id from session
        var postdata = req.body;
        const range_id = req.session.user.range_id;
        var range_code = postdata.range_id;
        var title = 'Election Upcoming';
        const select = "a.id,a.cop_soc_name,a.last_elec_date,a.tenure_ends_on,a.elec_due_date,a.reg_no,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
        if(range_id > 0){ 
          var select_type = postdata.soc_type > 0 ? `AND a.range_code = '${postdata.soc_type}'` : '' ;
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' ${select_type} AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 2 MONTH) AND a.range_code = "${range_id}" `;
        }else{
          var select_range = range_code > 0 ? `AND a.range_code = '${range_code}'` : '' ;
          var select_type = postdata.soc_type > 0 ? `AND a.range_code = '${postdata.soc_type}'` : '' ;
          var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' ${select_range+select_type} AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 2 MONTH) `;
        }
    
        // Execute database query
        const result = await db_Select(select, table_name, null, null);
        const ranzeres = await db_Select('*', 'md_range',`range_id=${range_code}`, null);
      // console.log(ranzeres);
        if(range_code > 0){
          range_name = ranzeres.msg[0].range_name;
        }else{
          range_name =  'ALL Range';
        }
        // Prepare data for rendering
        const res_dt = {
          data: result.suc > 0 ? result.msg : '',
          page: 1,range_name:range_name,range:postdata.range_id,soc_type:postdata.soc_type,
          socname:'',title:title,soc_data_status:''
        };
        // Render the view with data
        res.render('report/election_result_upcoming', res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
        res.render('report/election_result_upcoming', res_dt);
      }
  })
  reportRouter.get('/downloadexcel_past', async (req, res) => {
    try {
       var range = req.query.range_code > 0 ? `AND a.range_code=${req.query.range_code} ` : '';
       var soc_type = req.query.soc_type_id > 0 ? `AND a.soc_type=${req.query.soc_type_id} ` : '';
        const select = "a.cop_soc_name, a.reg_no, a.reg_date, b.soc_type_name, f.soc_tier_name, h.controlling_authority_type_name AS reg_cont_auth, g.controlling_authority_name AS returning_officer, st.state_name, c.dist_name, d.zone_name, e.range_name, a.urban_rural_flag, ulcat.ulb_catg_name, ulb.ulb_name, wa.ward_name, mb.block_name, gp.gp_name, vill.vill_name, a.pin_no, a.address, mms.manage_status_name, mot.officer_type_name, a.num_of_memb, a.audit_upto, a.last_elec_date, a.tenure_ends_on, a.contact_name AS key_person, a.contact_designation AS key_person_desig, a.contact_number, a.email, a.case_id, a.case_num, a.functional_status";
        const table_name = `md_society a 
            LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id 
            LEFT JOIN md_district c ON a.dist_code = c.dist_code 
            LEFT JOIN md_controlling_authority_type h ON a.cntr_auth_type = h.controlling_authority_type_id 
            LEFT JOIN md_controlling_authority g ON a.cntr_auth = g.controlling_authority_id 
            LEFT JOIN md_state st ON a.state_code = st.state_id 
            LEFT JOIN md_ulb_catg ulcat ON a.ulb_catg = ulcat.ulb_catg_id 
            LEFT JOIN md_ulb ulb ON a.ulb_id = ulb.ulb_catg_id 
            LEFT JOIN md_ward wa ON a.ward_no = wa.ward_id 
            LEFT JOIN md_block mb ON a.block_id = mb.block_id 
            LEFT JOIN md_gp gp ON a.gp_id = gp.gp_id 
            LEFT JOIN md_village vill ON a.vill_id = vill.vill_id 
            LEFT JOIN md_management_status mms ON a.mgmt_status = mms.manage_status_id 
            LEFT JOIN md_officer_type mot ON a.officer_type = mot.officer_type_id 
            LEFT JOIN md_zone d ON a.zone_code = d.zone_id 
            LEFT JOIN md_range e ON a.range_code = e.range_id 
            LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id`;
            var con = `a.tenure_ends_on < CURDATE()`;

        const where = `${con + range + soc_type}`; // Ensure these variables are properly defined
        const res_dt = await db_Select(select, table_name, where,null);

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        // Define column headers
        worksheet.columns = [
            { header: 'Society Name', key: 'cop_soc_name' },
            { header: 'Registration No', key: 'reg_no' },
            { header: 'Registration Date', key: 'reg_date' },
            { header: 'Society Type', key: 'soc_type_name' },
            { header: 'Tier Name', key: 'soc_tier_name' },
            { header: 'Controlling Authority Type', key: 'reg_cont_auth' },
            { header: 'Returning Officer', key: 'returning_officer' },
            { header: 'State', key: 'state_name' },
            { header: 'District', key: 'dist_name' },
            { header: 'Zone', key: 'zone_name' },
            { header: 'Range', key: 'range_name' },
            { header: 'Urban/Rural', key: 'urban_rural_flag' },
            { header: 'ULB Category', key: 'ulb_catg_name' },
            { header: 'ULB Name', key: 'ulb_name' },
            { header: 'Ward', key: 'ward_name' },
            { header: 'Block', key: 'block_name' },
            { header: 'Gram Panchayat', key: 'gp_name' },
            { header: 'Village', key: 'vill_name' },
            { header: 'PIN No', key: 'pin_no' },
            { header: 'Address', key: 'address' },
            { header: 'Management Status', key: 'manage_status_name' },
            { header: 'Officer Type', key: 'officer_type_name' },
            { header: 'Number of Members', key: 'num_of_memb' },
            { header: 'Audit Up To', key: 'audit_upto' },
            { header: 'Last Election Date', key: 'last_elec_date' },
            { header: 'Tenure Ends On', key: 'tenure_ends_on' },
            { header: 'Key Person', key: 'key_person' },
            { header: 'Designation', key: 'key_person_desig' },
            { header: 'Contact Number', key: 'contact_number' },
            { header: 'Email', key: 'email' },
            { header: 'Case ID', key: 'case_id' },
            { header: 'Case Number', key: 'case_num' },
            { header: 'Functional Status', key: 'functional_status' },
        ];
         var result = res_dt.suc > 0 ? res_dt.msg : '';
        // Add rows to the worksheet
        result.forEach(item => {
            worksheet.addRow(item);
        });

        // Set response headers for the Excel file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

        // Write the Excel file to the response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error during Excel generation:', error);
        res.status(500).json({ error: 'An error occurred while generating the report.' });
    }
});

reportRouter.get('/downloadexcel_upcoming', async (req, res) => {
  try {
     var range = req.query.range_code > 0 ? `AND a.range_code=${req.query.range_code} ` : '';
     var soc_type = req.query.soc_type_id > 0 ? `AND a.soc_type=${req.query.soc_type_id} ` : '';
      const select = "a.cop_soc_name, a.reg_no, a.reg_date, b.soc_type_name, f.soc_tier_name, h.controlling_authority_type_name AS reg_cont_auth, g.controlling_authority_name AS returning_officer, st.state_name, c.dist_name, d.zone_name, e.range_name, a.urban_rural_flag, ulcat.ulb_catg_name, ulb.ulb_name, wa.ward_name, mb.block_name, gp.gp_name, vill.vill_name, a.pin_no, a.address, mms.manage_status_name, mot.officer_type_name, a.num_of_memb, a.audit_upto, a.last_elec_date, a.tenure_ends_on, a.contact_name AS key_person, a.contact_designation AS key_person_desig, a.contact_number, a.email, a.case_id, a.case_num, a.functional_status";
      const table_name = `md_society a 
          LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id 
          LEFT JOIN md_district c ON a.dist_code = c.dist_code 
          LEFT JOIN md_controlling_authority_type h ON a.cntr_auth_type = h.controlling_authority_type_id 
          LEFT JOIN md_controlling_authority g ON a.cntr_auth = g.controlling_authority_id 
          LEFT JOIN md_state st ON a.state_code = st.state_id 
          LEFT JOIN md_ulb_catg ulcat ON a.ulb_catg = ulcat.ulb_catg_id 
          LEFT JOIN md_ulb ulb ON a.ulb_id = ulb.ulb_catg_id 
          LEFT JOIN md_ward wa ON a.ward_no = wa.ward_id 
          LEFT JOIN md_block mb ON a.block_id = mb.block_id 
          LEFT JOIN md_gp gp ON a.gp_id = gp.gp_id 
          LEFT JOIN md_village vill ON a.vill_id = vill.vill_id 
          LEFT JOIN md_management_status mms ON a.mgmt_status = mms.manage_status_id 
          LEFT JOIN md_officer_type mot ON a.officer_type = mot.officer_type_id 
          LEFT JOIN md_zone d ON a.zone_code = d.zone_id 
          LEFT JOIN md_range e ON a.range_code = e.range_id 
          LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id`;
          var con = `a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 2 MONTH)`;

      const where = `${con + range + soc_type}`; // Ensure these variables are properly defined
      const res_dt = await db_Select(select, table_name, where,null);

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      // Define column headers
      worksheet.columns = [
          { header: 'Society Name', key: 'cop_soc_name' },
          { header: 'Registration No', key: 'reg_no' },
          { header: 'Registration Date', key: 'reg_date' },
          { header: 'Society Type', key: 'soc_type_name' },
          { header: 'Tier Name', key: 'soc_tier_name' },
          { header: 'Controlling Authority Type', key: 'reg_cont_auth' },
          { header: 'Returning Officer', key: 'returning_officer' },
          { header: 'State', key: 'state_name' },
          { header: 'District', key: 'dist_name' },
          { header: 'Zone', key: 'zone_name' },
          { header: 'Range', key: 'range_name' },
          { header: 'Urban/Rural', key: 'urban_rural_flag' },
          { header: 'ULB Category', key: 'ulb_catg_name' },
          { header: 'ULB Name', key: 'ulb_name' },
          { header: 'Ward', key: 'ward_name' },
          { header: 'Block', key: 'block_name' },
          { header: 'Gram Panchayat', key: 'gp_name' },
          { header: 'Village', key: 'vill_name' },
          { header: 'PIN No', key: 'pin_no' },
          { header: 'Address', key: 'address' },
          { header: 'Management Status', key: 'manage_status_name' },
          { header: 'Officer Type', key: 'officer_type_name' },
          { header: 'Number of Members', key: 'num_of_memb' },
          { header: 'Audit Up To', key: 'audit_upto' },
          { header: 'Last Election Date', key: 'last_elec_date' },
          { header: 'Tenure Ends On', key: 'tenure_ends_on' },
          { header: 'Key Person', key: 'key_person' },
          { header: 'Designation', key: 'key_person_desig' },
          { header: 'Contact Number', key: 'contact_number' },
          { header: 'Email', key: 'email' },
          { header: 'Case ID', key: 'case_id' },
          { header: 'Case Number', key: 'case_num' },
          { header: 'Functional Status', key: 'functional_status' },
      ];
       var result = res_dt.suc > 0 ? res_dt.msg : '';
      // Add rows to the worksheet
      result.forEach(item => {
          worksheet.addRow(item);
      });

      // Set response headers for the Excel file
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

      // Write the Excel file to the response
      await workbook.xlsx.write(res);
      res.end();
  } catch (error) {
      console.error('Error during Excel generation:', error);
      res.status(500).json({ error: 'An error occurred while generating the report.' });
  }
});


module.exports = {reportRouter}
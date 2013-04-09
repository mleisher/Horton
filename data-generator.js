(function(w, undefined) {
  var firstNames = ['Elodia', 'Sephnie', 'Maxine', 'Claudine', 'Londa', 'Gwyn', 'Consuelo', 'Mariko', 'Lashanda', 'Jesusa', 'Bernie', 'Annamaria', 'Muriel', 'Nikia', 'Margene', 'Lorraine', 'Annemarie', 'Rayna', 'Anonina', 'Carie', 'Gran', 'Jua', 'Jacqulyn', 'Whiney', 'Renaa', 'Usha', 'Annea', 'Jack', 'Chun', 'Eddy', 'Isidra', 'Myesha', 'Ami', 'Easer', 'Karon', 'Granville', 'Maria', 'Shenia', 'Solomon', 'Marquia', 'Charles', 'Neie', 'Beariz', 'Humbero', 'Rigobero', 'Lamon', 'Rivka', 'Phoebe', 'Renea', 'Celia', 'Shay', 'Sanford', 'Gwen', 'Lizzee', 'Lucila', 'Alice', 'Lauri', 'Desmond', 'Raeann', 'Rona', 'Jason', 'Lilian', 'Karena', 'Dennise', 'Delana', 'Rheba', 'Doy', 'Dolly', 'Venice', 'Dalene', 'Cyndy', 'Ilona', 'Lakeshia', 'Laurena', 'Lorriane', 'Kaci', 'Velve', 'Maple', 'Maire', 'Marline', 'Bar', 'Nelly', 'Shona', 'Karole', 'Judi', 'Ardelia', 'Alonzo', 'Junie', 'Alvina', 'Ilda'];
  var lastNames = ['Ortego', 'Landa', 'Piermarini', 'Valles', 'Lusher', 'Branco', 'Falls', 'Hallett', 'Nicley', 'Cambareri', 'Han', 'Edwin', 'Lan', 'Dauenhauer', 'Cerrone', 'Matsumura', 'Mosher', 'Dragoo', 'Robare', 'Judon', 'Kyger', 'Bonk', 'McGaughy', 'McFetridge', 'Maxton', 'Roling', 'Klotz', 'Boudreaux', 'Hayton', 'Leonardo', 'Schug', 'Dewitt', 'Wohlwend', 'Hoos', 'Pennock', 'Sprinkle', 'Weick', 'Gilliland', 'Resler', 'Badgett', 'Bittinger', 'Letts', 'Bottom', 'Hibler', 'Fuhrman', 'Lewis', 'Moudy', 'Goyette', 'DiFranco', 'Kyles', 'Sluss', 'Bruening', 'Halladay', 'Leinen', 'Leister', 'Morgado', 'Wadkins', 'Yingst', 'Hyland', 'Carasco', 'Stever', 'Weisz', 'Woldt', 'Leak', 'Sinclair', 'Heinen', 'Furniss', 'Hosler', 'Shumpert', 'Keasler', 'Stgelais', 'Landers', 'Hogle', 'Ates', 'Vanatta', 'Goodlow', 'Haner', 'Yaple', 'Lamark', 'Cataldo', 'Smelcer', 'Marco', 'Quaranta', 'Cooke', 'Ardrey', 'Guilford', 'Polo', 'Sprouse', 'Gaffney', 'LaFromboise'];
  var jobTitles = ['Language Translator', 'Propeller-Driven Airplane Mechanic', 'Work Ticket Distributor', 'Pipe Organ Technician', 'LAN Systems Administrator', 'Employment Clerk', 'Electrical Lineworker', 'Serials Librarian', 'Technical Services Librarian', 'Blackjack Supervisor', 'Pulpwood Cutter', 'Military Science Teacher', 'Missile Pad Mechanic', 'Psychology Professor', 'Scene and Lighting Design Lecturer', 'Internet Marketing Manager', 'Business Services Sales Representative', 'Assistant Corporation Counsel', 'Photocopying Equipment Repairer', 'Post-Anesthesia Care Unit Nurse', 'Animal Husbandry Manager', 'Electrical Engineering Director', 'Drag Car Racer', 'Auto Detailer', 'Childrens Pastor', 'Strawberry Sorter', 'Geophysicist', 'Financial Accountant', 'Crown and Bridge Technician', 'Jig Bore Tool Maker', 'Union Representative', 'High School Librarian', 'High School History Teacher', 'Beveling and Edging Machine Operator', 'Roller Skater', 'Wallpaperer Helper', 'Childcare Center Administrator', 'Ordnance Engineer', 'Industrial Waste Treatment Technician', 'Airline Transport Pilot', 'Window Trimmer', 'Garment Presser', 'State Archivist', 'Die Designer', 'Ventriloquist', 'Calculus Professor', 'Technical Writer', 'Meat Packager', 'Automobile Body Painter', 'Aircraft Landing Gear Inspector', 'Fashion Designer', 'Drywall Stripper', 'Clown', 'National Association for Stock Car Auto Racing Driver', 'Staff Electronic Warfare Officer', 'Hydroelectric Machinery Mechanic', 'Clinical Services Director', 'Traffic Court Referee', 'Internal Medicine Nurse Practitioner', 'Horticulture Instructor', 'Ships Electronic Warfare Officer', 'Broadcast Maintenance Engineer', 'Weight Training Instructor', 'Potato Sorter', 'Appliance Parts Counter Clerk', 'Body Shop Supervisor', 'Accounts Collector', 'Commercial Lender', 'Scale Clerk', 'Obstetrician/Gynecologist', 'Gaming Cage Cashier', 'Fresco Artist', 'Youth Pastor', 'Parachute Officer', 'Geophysical Engineer', 'Route Sales Person', 'Master of Ceremonies', 'Cloak Room Attendant', 'Gas Main Fitter', 'Religious Activities Director', 'Hemodialysis Technician', 'Telephone Lines Repairer', 'Periodontist', 'Wood Fence Installer', 'Offbearer', 'Aviation Tactical Readiness Officer', 'Biology Laboratory Assistant', 'Emergency Room Orderly', 'Magician', 'Dog Trainer'];
  var statuses = [{ 'name': 'Active', 'value': 1 }, { 'name': 'Disabled', 'value': 2 }, { 'name': 'Suspended', 'value': 3 }];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var phones = ['437-575-4315','806-704-9285','304-894-5823','783-713-9947','234-655-9790','335-990-2629','537-296-5553','452-375-7248','586-845-3403','283-555-3016','290-786-8808','453-815-2133','414-340-8337','239-746-4126','753-797-2675','324-523-2468','817-764-9647','756-755-6269','356-334-2780','951-863-2566','427-211-6403','205-205-6525','277-889-1842','933-668-8024','353-270-7288','711-772-5274','699-331-1785','493-654-9491','346-330-8982','912-538-5129','601-996-8023','479-354-1446','827-827-6962','470-638-2469','722-837-1675','943-540-4483','468-507-3190','671-221-3516','725-560-4669','687-384-7546','496-952-7382','613-827-8596','857-886-1380','416-596-4111','388-907-3336','769-625-1207','668-322-8630','462-486-3056','977-902-1430','832-515-6145','980-948-7898','321-737-8393','713-975-5206','885-782-5510','716-204-9280','610-591-6700','666-236-4396','583-683-7514','408-721-1610','849-273-1734','642-210-3318','260-781-7197','912-200-2170','466-992-7110','736-605-8956','603-448-3590','769-634-9013','594-485-8561','925-831-1730','951-216-3057','553-636-9460','404-446-4966','916-404-8009','915-645-5067','925-945-4898','856-417-8324','875-428-5846','649-320-3636','599-410-8513','877-968-3365','805-274-2708','816-584-5294','593-237-3671','639-338-2829','311-553-1475','836-893-3029','653-863-6263','741-650-4925','428-495-8943','613-704-1828'];

  function randomDate() {
    var start = new Date(1960, 0, 1), end = new Date(1994, 0, 1);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  w.generateRows = function(rows, extraCols, asString) {
    rows = rows || 100;
    extraCols = extraCols || 0;
      var rs = '';
    for (var i = 0; i < rows; i++) {
      var data = {
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
	email: null,
	phone: phones[Math.floor(Math.random() * phones.length)],
        dob: randomDate()
      };
      data.email = data.firstName.toLowerCase()+'@'+data.lastName.toLowerCase()+'.com';
      var row = '<tr>';
      //row += '<td class="expand"></td>';
      row += '<td>' + data.firstName + '</td>';
      row += '<td>' + data.lastName + '</td>';
      row += '<td>' + data.jobTitle + '</td>';
      row += '<td>' + data.email + '</td>';
      row += '<td>' + data.phone + '</td>';
      row += '<td data-value="' + data.dob.getDate() + '" data-sort-key="' + data.dob.getTime() + '">' + data.dob.getDate() + ' ' + months[data.dob.getMonth()] + ' ' + data.dob.getFullYear() +'</td>';
      row += '<td data-value="' + data.status.value + '">' + data.status.name + '</td>';
      for (var j = 0; j < extraCols; j++) {
        row += '<td>' + (i+1) + '.' + (j+1) + '</td>';
      }
      row += '</tr>';
	if (asString)
	    rs += row;
	else
	    document.writeln(row);
    }
      if (asString)
	  return rs;
  };
})(window);

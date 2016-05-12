class Bootstrapper{
	static Run(){
		var deferred = $.Deferred();
		// Closes the Responsive Menu on Menu Item Click
		$('.navbar-collapse ul li a').click(()=>{
		    $('.navbar-toggle:visible').click();
		});

		// Highlight the top nav as scrolling occurs
		$('body').scrollspy({
		    target: '.navbar-fixed-top'
		});

		// Load Templates
		async.series([
				(callback)=>{
					$('#guest-order-form-tmpl')
					.load('./templates/guest-order-form-tmpl.html', (res, status, jqHXR)=>{
						if(status==="error"){
							callback("Application failed to initialize.");
						} else {
							callback();
						}
					});
				},
				// (callback)=>{
				// 	$('#user-order-form-tmpl')
				// 	.load('./templates/user-order-form-tmpl.html', (res, status, jqHXR)=>{
				// 		if(status==="error"){
				// 			callback("Application failed to initialize.");
				// 		} else {
				// 			callback();
				// 		}
				// 	});
				// },
				(callback)=>{
					// Cache Appointment Data
					var storageHelper = new LocalStorageHelper(sessionStorage);
					var webSvc = new WebService();
					var orderFormVm = new OrderFormViewModel(storageHelper, webSvc);
					var logInVm = new LogInViewModel();
					
					var mainVm = new MainViewModel(storageHelper, logInVm, orderFormVm);

					ko.applyBindings(mainVm);

					webSvc.GetAllAppointments()
						.then((appointments)=> {
							var apptsByDate = _.groupBy(appointments, (x)=> moment(x.date).format("MM/DD/YYYY"));
							storageHelper.AppointmentsByDate = apptsByDate;
							callback();
						})
						.fail((err)=>{
							callback(err);
					});

				}
			],
			(possibleError)=>{
				if(possibleError){
					deferred.reject(possibleError);
				} else {
					deferred.resolve();
				}
			});

		return deferred.promise();
	}
}

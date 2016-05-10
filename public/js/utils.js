class Utils{
	static GetListOfDisabledDates(apptsByDate){
		if(!apptsByDate){
			return [];
		}

		var datesToDisable = [];

		for (var key in apptsByDate){
			if(apptsByDate.hasOwnProperty(key)){
				var time = 0;
				var appts = apptsByDate[key];
				_.each(appts, (a)=>{
					if(a.timeEstimate){
						time+=a.timeEstimate;
					} else {
						// default time estimate in minutes
						time+=Contsants.DEFAULT_JOB_TIME_MINS;
					}
				});
				if(time > Constants.MAX_JOB_TIME_PER_DAY_MINS){
					datesToDisable.push(_.first(appts).date);
				}
			}
		}

		return datesToDisable;
	};

	static GenerateUUID(){
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	};
}
$(function() {
    var model = {
        newModel: function() {
            console.log('Creating attendance records...');

            function getRandom() {
                return (Math.random() >= 0.5);
            }

            var nameColumns = $('tbody .name-col'),
                attendance = {};

            nameColumns.each(function() {
                var name = this.innerText;
                attendance[name] = [];

                for (var i = 0; i <= 11; i++) {
                    attendance[name].push(getRandom());
                }
            });

            localStorage.attendance = JSON.stringify(attendance);
        },
        updateLocalStorage: function(data) {
        	localStorage.attendance = JSON.stringify(data);
        },
        init: function() {
            if (!localStorage.attendance) {
                this.newModel();
            }
			console.log("aobut to add variables");
            this.attendance = JSON.parse(localStorage.attendance)
            this.$allMissed = $('tbody .missed-col')
            this.$allCheckboxes = $('tbody input');
            console.log("just instantiated variables");
        },
    };

    var controller = {
        init: function() {
            model.init();            
            view.init();
        },
        countMissing: function() {
            model.$allMissed.each(function() {
                var studentRow = $(this).parent('tr'),
                    dayChecks = $(studentRow).children('td').children('input'),
                    numMissed = 0;

                dayChecks.each(function() {
                    if (!$(this).prop('checked')) {
                        numMissed++;
                    }
                });                
                view.renderDaysMissed($(this),numMissed);
            });
        },
        clickWatch: function() {
        	console.log("in clickwatch");
            model.$allCheckboxes.on('click', function() {
                var studentRows = $('tbody .student'),
                    newAttendance = {};

                studentRows.each(function() {
                    var name = $(this).children('.name-col').text();
                    model.$allCheckboxes = $(this).children('td').children('input');

                    newAttendance[name] = [];

                    model.$allCheckboxes.each(function() {
                        newAttendance[name].push($(this).prop('checked'));
                    });
                });

                controller.countMissing();
                model.updateLocalStorage(newAttendance);

            });
        },
        
    };

    var view = {
        init: function() {            
            this.render();
            controller.clickWatch();
            controller.countMissing();
        },
        renderDaysMissed: function(elem,days){        	
        	
        	elem.text(days);
        },

        render: function() {
            $.each(model.attendance, function(name, days) {
                var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                    dayChecks = $(studentRow).children('.attend-col').children('input');

                dayChecks.each(function(i) {
                    $(this).prop('checked', days[i]);
                });
            });
        },
    };
controller.init();
});

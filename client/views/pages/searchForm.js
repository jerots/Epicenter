Template.searchForm.onRendered(function () {

    //instantiate datepicker
    this.$('.datetimepicker').datetimepicker();

    var $viralStatsContainer = this.$('#viralStatsContainer');

    this.$('select#viralMode').change(function () {
        var virus = $(this).val();
        console.log(virus);
        $viralStatsContainer.html('<img src="' + virus + '.png">');
    });

});
Template.suspectTableMini.onRendered(function () {
    this.$('.datatable').each(function () {
        $(this).DataTable({
            paging: false,
            info: false,
            searching: false,
            aoColumns: [null, null, null, null, null, null]
        });
    });
});

Template.suspectTableMini.helpers({
    suspects: function () {
		var fake4 = Session.get('searchResult');
        return fake4;
    }
});
Router.configure({
    layoutTemplate: 'mainLayout',
    loadingTemplate: 'loading'
});

Router.route('/', function () {
    Router.go('uploadsearch');
});

Router.route('search');
Router.route('simulator');
Router.route('uploadsearch');

Router.route('network');
Router.route('networkView');

Router.route('loading'); 
Router.route('searchRun');
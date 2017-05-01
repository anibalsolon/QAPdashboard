import '../imports/ui/body.js';
import '../imports/ui/showImage.js';
import '../imports/ui/routers.js'

//add bootstrap to datatable
import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
dataTablesBootstrap(window, $);
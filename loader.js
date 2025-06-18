autowatch=1;

inlets = 3;
outlets = 6;

var p = this.patcher;
p.innerHeight=200;
p.innerWidth=300;
var banksMenuParams = p.menuBanks;
var banksData;
var currentPresets = [];

var currentBank;
var currentPreset;
var thePresets = []
var thePresetsPC = [];
var bankNames = [];
var path = '';
var GLOBAL_EMUX;
var GLOBAL_BANK = '';
var GLOBAL_CURRENT_PC = -1;
var GLOBAL_CURRENT_BANK = -1;

function listChildren(a) {
    var obj = b.firstobject;
    while (obj) {
        //post("Found object: " + obj.varname + " of class " + obj.maxclass + "\n");

        if ( obj.varname == a ){
            return obj;
        }
        obj = obj.nextobject;
    }
}





function presets(a){
    if ( a ){
        // //post ( '\nCategory => ' + a );
        // //post ( '\n' + GLOBAL_EMUX.length );
        GLOBAL_BANK = a;
        GLOBAL_CURRENT_BANK = a;
        var arr = [];
        for ( n=0 ; n < GLOBAL_EMUX.length ; n++ ){
            if ( GLOBAL_EMUX[n]['Category'] === a ){
                //post ( '\nPRESET => ' + GLOBAL_EMUX[n]['Name'] );
                arr.push ( GLOBAL_EMUX[n]['Name'] );
            }
        }
        outlet ( 1 , arr );
    }
}

function select(index){
    var pp = GLOBAL_EMUX;
    GLOBAL_CURRENT_BANK = index;
    for ( n = 0 ; n < pp.length ; n++ ){
        // //post ( "\n" + pp[n] );
        if ( pp[n]['Name'] === index ){
            GLOBAL_CURRENT_PC = n;
            setCurrentPreset(n);
        }
    }
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}


//This function read a txt file you can upload from the UI
//Depends on the format you have my format is the example in Presets.txt
//The file is created automatically by EmulatorX3 VST Export function
//Explanation:
// - loops thru all lines of the file
// - finds the line that starts with Number
//      (Number  	Bank:Prog   	Name                              	Category)
// - starting from the next line read each line and then: 
//      - split each line into an array
//          - example: 
//            - 000     	000:000     	syn:Vintage                       	Synthesizer
//              arr = [000,000:000,syn:Vintage,Syntesizer]
//      - add arr[3] element (Synthesizer) to the bankNames array
//      - create an object :
//              {
//                  "No"        : arr[1],
//                  "Name"      : arr[2],
//                  "Category"  : arr[3]
//              }
//     - add the object to the GLOBAL_EMUX array
//     - add the preset name arr[2] to the bankPresets array
//
function readFile(a){
    if ( !path ) {
        return;
    }
    // var path = "MODULA KONTROL 6-VOICE FX.txt";//"MODULA KONTROL 7-Performance2.txt";
    memstr = "";
    var maxchars = 800;
    var f = new File(path,"read");
    f.open();
    thePresets = [];
    thePresetsPC = [];
    bankNames = [];
    // var reader = new FileReader();
    // reader.onload = () => {
    
    if (f.isopen) {
        while(f.position<f.eof) {
            memstr+=f.readstring(maxchars);
        }
        f.close();
        var lines = memstr.split('\n');
        // //post("\nRead Success: "+path);
        
        //post("\n" + lines.length );
        GLOBAL_EMUX = [];
        for ( n = 0 ; n < lines.length ; n++ ){
            if ( lines[n].indexOf ( 'Number' ) > -1 ){
                var nextToRead = n + 1;
                var add = true;
                var bankNr = -1;
                var bankName = "";
                var bankPresets = [];
                for ( l = nextToRead ; l < lines.length ; l++ ){
                    var line = lines[l].split("\t");
                    if ( line.length == 4 ){
                        bankNames.push ( line[3] );
                        GLOBAL_EMUX.push ( { "No" : line[1] , "Name" : replaceAll(line[2]," ","") , "Category" : line[3] } );
                        bankPresets.push ( line[2] );
                    }
                }
            }
        }
        var bb = [];
        for ( n = 0 ; n<bankNames.length ; n++ ){
            if ( bb.indexOf(bankNames[n]) < 0){
                bb.push ( bankNames[n] );
            }
        }

        for ( b = bankNames.length ; b < 128 ; b++ ){
            bankNames.push ( '--------' );
        }
        
        //post ( '\nTotal presets => ' + GLOBAL_EMUX.length );
        outlet(0,bb.sort());
    } else {
        //post("\nRead Error: "+path);
    }
}

function msg_int (a){
    if ( inlet == 1 ){
        //post ( "BANK => " + banksData[a] );
        //var currentBank = a;
        var lista = [];
        var allPresets = ciccio[a];
        currentPresets = [];
        for ( n = 0 ; n < allPresets.length ; n++ ){
            lista.push ( allPresets[n]['NAME'] );
        }
        if ( allPresets.length < 128 ){
            for ( n = allPresets.length ; n < 128 ; n ++ ){
                lista.push ( '---------' );
            }
        }
        currentPresets = lista;
        outlet(1,lista);
        //this.presets ( a );
    }
    if ( inlet == 2 ){
        //post ( "PRESET => " + currentPresets[a] )
        currentPreset = a;
    }
}

function increment(a){
    if ( inlet == 1 ){
        currentBank = currentBank +1;
        this.presets(currentBank);
        outlet ( 2 , currentBank );

    }
    if ( inlet == 2 ){
        if ( !a){
            GLOBAL_CURRENT_PC += 1;
        } else {
            GLOBAL_CURRENT_PC = 0;
        }
        presetCursor(1);
    }
}

function decrement(a){
    if ( inlet == 2 && GLOBAL_CURRENT_PC){
        if ( GLOBAL_CURRENT_PC > 1){
            GLOBAL_CURRENT_PC += -1;
        }
        presetCursor();
    }
}



function presetCursor(value){
    if ( GLOBAL_EMUX[GLOBAL_CURRENT_PC] ){
        //post ( GLOBAL_CURRENT_PC );
        var pp = GLOBAL_EMUX[GLOBAL_CURRENT_PC];
        var bn = pp['No'].split(':')[0];
        var pc = pp['No'].split(':')[1];
        if ( !parseInt(bn.replace(/^0+/, ''))  ){
            bn = 0;
        } else {
            bn = parseInt(bn.replace(/^0+/, ''));
        }
        if ( !parseInt(pc.replace(/^0+/, '')) ){
            pc = 0;
        } else {
            pc = parseInt(pc.replace(/^0+/, ''));
        }
        outlet(2,pp['Category']);
        outlet(3,pp['Name']);
        outlet(4,[bn,pc]);
        outlet(5,GLOBAL_CURRENT_PC);
    }
}

function setCurrentPreset(value){
    GLOBAL_CURRENT_PC = value;
    if ( GLOBAL_EMUX[GLOBAL_CURRENT_PC] ){
        var pp = GLOBAL_EMUX[GLOBAL_CURRENT_PC];
        var bn = pp['No'].split(':')[0];
        var pc = pp['No'].split(':')[1];
        if ( !parseInt(bn.replace(/^0+/, ''))  ){
            bn = 0;
        } else {
            bn = parseInt(bn.replace(/^0+/, ''));
        }
        if ( !parseInt(pc.replace(/^0+/, '')) ){
            pc = 0;
        } else {
            pc = parseInt(pc.replace(/^0+/, ''));
        }
        outlet(2,pp['Category']);
        outlet(3,pp['Name']);
        outlet(4,[bn,pc]);
    }   outlet(5,GLOBAL_CURRENT_PC);
}

function msg_string(a){
    //post ( '-------------------------------------------');
    if ( inlet === 2){
        //post ( a );
    }
}

function loadFile(a){
    if ( arguments.length ){    
        path = arguments[0];
        readFile();
    }
}

function trim(){
    if ( arguments.length ){
        var trimmed = arguments[0];
        outlet(3,trimmed);
    }
}
import React, {Component} from 'react';
const data = [
    { ProductName: "Left Headlight", PhotoFileName: "headlight.png", Make: "Mazda", Model:"Mazda 6", Year:2006, Stock:4  }
  ]
export class Home extends Component{


    render() {
        return(
            
            <body class="stackedit">
              <div class="stackedit__html"><p>This is a demo application to store and manage automotive parts with a simplistic schema. CSVs can be uploaded and should be in the following format:</p>
            {/* TODO: Replace breaks with real styling */}
            <pre><code>ProductName, PhotoFileName, Make, Model, Year, Stock <br></br>
            Headlight, default.png, Mazda, Mazda 6, 2006, 5 <br></br>
            Transmission, default.png,Ford, Explorer, 2001, 1 <br></br>
            </code></pre>
            <p>Please visit the  <a href="https://github.com/jackld2/React-Product-DB">Github</a> for more information</p>
            </div>
            </body>

        )
    }
}
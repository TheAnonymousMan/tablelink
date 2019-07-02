// Don't Panic.

import React from 'react';
import axios from 'axios';

class App extends React.Component
{
  // Initializing the state here.
  state = 
  {
    data: [],
    id: 0,
    name: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    updateToApply:null
  };

  // This runs (1 second) after the render is done.
  // This sets the interval.
  componentDidMount()
  {
    this.getDataFromDb();
    if(!this.state.intervalIsSet)
    {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({intervalIsSet: interval});
    }
  }

  // If interval is set, it will kill the process, after the process is over.
  componentWillUnmount()
  {
    if(this.state.intervalIsSet)
    {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // This method fetches the data from the back.
  getDataFromDb = () =>
  {
    fetch('http://localhost:8080/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({data: res.data}));
  }
  
  // This method sends the name and the self-generated ID to the back to be added.
  putDataToDb = (name) =>
  {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while(currentIds.includes(idToBeAdded))
    {
      ++idToBeAdded;
    }
    var data = { id: idToBeAdded,
      name: name
    };
    console.log(" post " + idToBeAdded +" "+name);
    axios.post('http://localhost:8080/api/postData',{ data });
  }
  // This method sends the id to be deleted to the back.
  deleteFromDb = (idToDelete) =>
  {
    parseInt(idToDelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => 
    {
      if(dat.id == idToDelete)
      {
        objIdToDelete = dat._id;
      }
      console.log(typeof(idToDelete)+typeof(objIdToDelete));
      console.log(" dat.id "+dat.id+" dat._id "+dat._id+" objIdToDelete "+objIdToDelete+" idToDelete "+idToDelete );
    });
    console.log(" delete "+idToDelete+" "+objIdToDelete);
    axios.delete(`http://localhost:8080/api/deleteData/${objIdToDelete}`
      // headers:{
      //   'Content-Type': 'application/json'
      // },
      // data:objIdToDelete
    ).then(res => {
      console.log(res);
      console.log(res.data);
    });
  }

  // This method sends data and ID to be updated to the back.
  updateDb = (idToUpdate, updateToApply) => 
  {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach((dat) =>
    {
      if(idToUpdate === dat.id)
      {
        objIdToUpdate = dat._id;
      }
      console.log(" idToUpdate "+idToUpdate+typeof(idToUpdate)+" objIdToUpdate "+objIdToUpdate +typeof(objIdToUpdate))
    });
    console.log(" update "+idToUpdate+" "+objIdToUpdate);
    axios.post('http://localhost:8080/api/updateData',{
      id: objIdToUpdate,
      update: {name: updateToApply}
    });
  }

  render()
  {
    const {data} = this.state;
    return(
      <div className = 'container'>
        <br/>
        <h1>Database Test</h1>

        <ul>
          { data.length <= 0 
           ? 'NO DB ENTRIES YET'
           : data.map((dat) => 
            (
              <li  key = { dat.id } style={{ padding: '10px' }} >
                  <span style = {{ color: 'gray' }}> id: </span> {dat.id} <br/>
                  <span style = {{ color: 'gray' }}> name: </span> {dat.name} <br/>
                </li>
           )
          )
          }
        </ul>

        <div style = {{ padding: '10px' }}>
          <input
            type='text'
            onChange={(e) => this.setState({name: e.target.value})}
            placeholder="Add something..."
            style={{ width: '200px' }}
          />

          &nbsp;

          <button onClick={() => this.putDataToDB(this.state.name)}>
            ADD
          </button>
        </div>

        <div style={{ padding: '10px' }}>
          <input
            type="text"
            style={{width: '200px'}}
            onChange={(e) => this.setState({idToDelete:e.target.value})}
            placeholder='ID to delete here...'
          />

          &nbsp; 

          <button onClick={() => this.deleteFromDb(this.state.idToDelete)}>
            DELETE
          </button>
        </div>

        <div style={{ padding: '10px' }}>
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({idToUpdate: e.target.value})}
            placeholder='ID to Update...'
          />

          &nbsp;

          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ updateToApply: e.target.value })}
            placeholder='Update to apply...'
          />

          &nbsp;

          <button onClick={()=>this.updateDb(this.state.idToUpdate, this.state.updateToApply)}>
            UPDATE
          </button>
        </div>
      </div>
    )
  }
}

export default App;

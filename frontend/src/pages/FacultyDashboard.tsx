import Button from "../components/Button"

const FacultyDashboard = ({setToken}: {setToken: (token: string) => void}) => {
  return (
    <div>
        <h1>This is the Faculty Dashboards</h1>
        <p>Here you can view and manage the students</p>
        <Button content="Logout" color="secondary" onClick={() => setToken('')}/>
    </div>
  )
}

export default FacultyDashboard
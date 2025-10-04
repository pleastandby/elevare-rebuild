import Button from "../components/Button"

const StudenDashboard = ({setToken}: {setToken: (token: string) => void}) => {
  return (
    <div>
        <h1>This is the Student Dashboards</h1>
        <p>Here you can view and manage your profile</p>
        <Button content="Logout" color="secondary" onClick={() => setToken('')}/>
    </div>
  )
}

export default StudenDashboard
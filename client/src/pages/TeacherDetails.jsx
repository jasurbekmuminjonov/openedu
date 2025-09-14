import { useParams } from "react-router-dom";
const TeacherDetails = () => {
  const { id } = useParams();
  return (
    <div className="page">
      <p>{id}</p>
    </div>
  );
};

export default TeacherDetails;

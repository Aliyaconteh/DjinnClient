export default function Button({ children, onClick, type = "button" }) {
  return (
    <button onClick={onClick} type={type} className="btn">
      {children}
    </button>
  );
}
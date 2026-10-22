// CaseLettre reçoit une lettre de Ligne par props et l'affiche.
function CaseLettre({ lettre }) {
  return <span className="case-lettre" role="gridcell">{lettre}</span>
}

export default CaseLettre

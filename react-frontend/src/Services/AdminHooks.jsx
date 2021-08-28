import { useHistory } from "react-router-dom";
import { useApi } from "./Hooks";

export function useBusinessEnvironmentEvaluation() {
    const api = useApi()
    const history = useHistory()

    function evaluate(endPoint, dto, redirectionRoute) {
        return api.post(endPoint, dto)
            .then(() => history.push(redirectionRoute))
    }

    return {evaluate}
}

import { useHistory } from "react-router-dom";
import { useApi } from "./Hooks";

export function useStudentEvaluation() {
    const api = useApi()
    const history = useHistory()

    function evaluate(endPoint, dto, redirectionRoute) {
        return api.post(endPoint, dto)
            .then(() => history.push(redirectionRoute))
    }

    return {evaluate}
}

export function useEmployerOfferManagement() {
    const api = useApi()

    function decideHirement(endPoint, updatedApplication, setOfferCallback) {
        return api.put(endPoint, updatedApplication)
                .then(r => {
                    if (r) updatedApplication.state = r.data.state
                    setOfferCallback()
                })
    }

    function retrieveOffer(endPoint, setOfferCallback) {
        api.get(endPoint)
                .then(r => setOfferCallback(r))
    }

    return {decideHirement, retrieveOffer}
}
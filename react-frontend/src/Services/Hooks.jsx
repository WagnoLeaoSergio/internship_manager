import axios from "axios";
import {useContext, useEffect, useState} from "react";
import {RSocketClient} from "rsocket-core";
import {IdentitySerializer, JsonSerializer} from "rsocket-core/build";
import Flowable from "rsocket-flowable/build/Flowable";
import RSocketWebSocketClient from "rsocket-websocket-client";
import {ModalContext, SemesterContext} from "../App";
import AuthenticationService from "./AuthenticationService";

export function useModal() {
    const [isOpen, setOpen] = useState(false)

    function open() {
        setOpen(true)
    }

    function close() {
        setOpen(false)
    }

    return [isOpen, open, close]
}

export function useApi() {
    const {open} = useContext(ModalContext)
    const {semester} = useContext(SemesterContext)
    const user = AuthenticationService.getCurrentUser()
    const api = axios.create({
        baseURL: "http://localhost:8080/api/",
        timeout: 150000,
        headers: {
            authorization: "Basic " + btoa(user.email + ":" + user.password)
        }
    })
    api.interceptors.request.use(config => {
        if (semester)
            config.headers = {"X-Semester": semester, ...config.headers}

        return config
    })
    api.interceptors.response.use(response => response, error => {
        console.warn("Axios error: " + error)
        open()
    })

    return api
}

export function useNotificationChannel(userId) {
    const [sink, setSink] = useState(null)
    const [notifications, setNotifications] = useState([])
    const route = "notif/" + userId

    function acknowledge(index) {
        sink.onNext({
            data: notifications[index].id
        })

        setNotifications(prev => {
            prev.splice(index, 1)
            return [...prev]
        })
    }

    useEffect(() => {
        const flow = new Flowable(subscriber => {
            subscriber.onSubscribe({
                cancel: () => undefined,
                request: () => {
                    subscriber.onNext({
                        metadata: String.fromCharCode(route.length) + route,
                        data: "00000000-0000-0000-0000-000000000000"
                    });
                    setSink(subscriber);
                }
            });
        })

        const client = new RSocketClient({
            serializers: {
                data: JsonSerializer,
                metadata: IdentitySerializer
            },
            setup: {
                keepAlive: 60000,
                lifetime: 180000,
                dataMimeType: "application/json",
                metadataMimeType: "message/x.rsocket.routing.v0"
            },
            transport: new RSocketWebSocketClient({url: "ws://localhost:7000/"})
        })

        client.connect()
            .subscribe({
                onComplete: socket => {
                    socket.requestChannel(flow)
                        .subscribe({
                            onNext: ({data}) => {
                                if (!notifications.find(item => item === data))
                                    setNotifications(prev => {
                                        return [...prev, data]
                                    })
                            },
                            onSubscribe: sub => {
                                sub.request(0x7fffffff)
                            },
                            onError: console.error
                        })
                },
                onError: console.error
            });
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return [notifications, acknowledge]
}

export function useDateParser() {
    return date => {
        const m = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]
        const d = new Date(date)
        return d.getDate() + " " + m[d.getMonth()] + " " + d.getFullYear()
    }
}

export function useTimeParserFromDate() {
    return date => {
        return new Date(date).toLocaleTimeString("pt-BR", {hour12: false, hour: "numeric", minute: "2-digit"})
    }
}

export function useTimeFormatter() {
    return time => time.split(":")[0] + ":" + time.split(":")[1]
}

export function useFileReader() {
    return file => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }
}

export function usePersistentState(name) {
    const [current, setCurrent] = useState(JSON.parse(window.localStorage.getItem(name)))

    function set(value) {
        window.localStorage.setItem(name, JSON.stringify(value))
        setCurrent(value)
    }

    return [current, set]
}
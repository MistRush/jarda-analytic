<script setup>
    import Modal from '@/Components/Modal/Modal.vue';

    const props = defineProps({
        show: Boolean
    });

    const emit = defineEmits(['close']);
</script>

<template>
    <Modal
        :isVisible="show"
        position="center"
        size="small"
        :block-page="true"
        @update:is-visible="emit('close')"
        :z-index="6000"
    >
        <template v-slot:header>
            Nápověda
        </template>
        <template v-slot:body>
            <div class="dashboard-help">
                <div>Obecné</div>
                <ul>
                    <li>
                        <div class="icons">
                            <Icon icon="minus" :width="16" :height="16" color="black"/>
                        </div>
                        <div>Minimalizace/Maximalizace všech panelů</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="refresh" :width="16" :height="16" color="black"/>
                        </div>
                        <div>Obnovení všech načtených dat</div>
                    </li>
                </ul>
                <div>Panely</div>
                <ul>
                    <li>
                        <div class="icons">
                            <Icon icon="columns" :width="16" :height="16" color="black"/>
                        </div>
                        <div>Zobrazení kanbanového pohledu na úkoly řešitele</div>
                    </li>
                </ul>
                <div>Úkoly</div>
                <ul>
                    <li>
                        <div class="icons">
                            <Icon icon="drag" :width="16" :height="16" color="#cde" />
                        </div>
                        <div>Úchytka pro přesunutí úkolu do jiného panelu/sekce nebo pro změnu řazení úkolů</div>
                    </li>
                    <li>
                        <div class="icons">
                            <div class="priority low">
                                <div class="priority-point"></div>
                                <div class="priority-point"></div>
                                <div class="priority-point"></div>
                            </div>
                            <div class="priority medium">
                                <div class="priority-point"></div>
                                <div class="priority-point"></div>
                                <div class="priority-point"></div>
                            </div>
                            <div class="priority high">
                                <div class="priority-point"></div>
                                <div class="priority-point"></div>
                                <div class="priority-point"></div>
                            </div>
                        </div>
                        <div>Nízká/Střední/Vysoká priorita úkolu</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="exclamation-mark" :width="16" :height="16" color="#e22" />
                        </div>
                        <div>Úkol je hlášením chyby</div>
                    </li>
                    <li>
                        <div class="icons">
                            <div class="author">XX:</div>
                        </div>
                        <div>Iniciály autora úkolu</div>
                    </li>
                    <li>
                        <div class="icons">
                            <div class="solver">XX:</div>
                        </div>
                        <div>Iniciály řešitele úkolu</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="clip" :width="16" :height="16" color="#78a" />
                        </div>
                        <div>Úkol obsahuje přílohy</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="link" :width="16" :height="16" color="#78a" />
                        </div>
                        <div>Úkol obsahuje odkazy</div>
                    </li>
                    <li>
                        <div class="icons">
                            <div class="viewed"></div>
                            <div class="viewed not"></div>
                        </div>
                        <div>Zobrazený/Nezobrazený úkol</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="delete" :width="16" :height="16" color="#e22" />
                        </div>
                        <div>Kompletní smazání úkolu</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="checkmark-square" :width="16" :height="16" color="#24C586" />
                        </div>
                        <div>Rychlé přidání odpovědi se stavem 'Vyřešeno'</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="waiting-approve" :width="16" :height="16" color="#fb3" />
                        </div>
                        <div>Rychlé přidání odpovědi se stavem 'Čeká na schválení'</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="danger" :width="16" :height="16" color="#e22" />
                        </div>
                        <div>Rychlé přesunutí úkolu do sekce 'Prioritní'</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="clock-arrow" :width="16" :height="16" color="#7af" />
                        </div>
                        <div>Rychlé přesunutí úkolu do sekce 'Odložené'</div>
                    </li>
                    <li>
                        <div class="icons">
                            <div class="expected-hours">20h</div>
                        </div>
                        <div>Očekáváný počet hodin strávený řešením úkolu</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="euro" :width="16" :height="16" color="#abd" />
                        </div>
                        <div>Neúplně vyplněná očekávaná návratnost úkolu</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="euro" :width="16" :height="16" color="#24C586" />
                        </div>
                        <div>Očekávaná návratnost úkolu</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="calendar-checkmark" :width="16" :height="16" color="#abd" />
                        </div>
                        <div>Nenastavený deadline úkolu</div>
                    </li>
                    <li>
                        <div class="icons">
                            <Icon icon="calendar-checkmark" :width="16" :height="16" color="#24C586" />
                            <Icon icon="calendar-checkmark" :width="16" :height="16" color="#e22" />
                        </div>
                        <div>Před/Po deadline úkolu</div>
                    </li>
                    <li>
                        <div class="icons">
                            <div class="replies">
                                <Icon icon="feedback" :width="16" :height="16" color="#24C586" />
                                <div class="reply-count">2</div>
                            </div>
                        </div>
                        <div>Počet odpovědí úkolu</div>
                    </li>
                    <li>
                        <div class="icons">
                            <div class="sub-tasks">
                                <Icon icon="tasks" :width="16" :height="16" color="#000" />
                                <div class="sub-task-count">2</div>
                            </div>
                        </div>
                        <div>Počet podúkolů</div>
                    </li>
                </ul>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
    .dashboard-help {
        & > div {
            font-weight: 600;
            margin-bottom: .5rem;
        }

        ul {
            margin-bottom: 1rem;

            li {
                display: flex;
                align-items: center;
                gap: .5rem;
                margin: .25rem 0;

                .icons {
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    gap: .5rem;
                    width: 4rem;

                    .priority {
                        width: 1rem;
                        min-width: .25rem;
                        height: 21px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        align-items: center;

                        .priority-point {
                            width: .25rem;
                            height: .25rem;
                            border-radius: 50%;
                            background-color: #cde;
                        }

                        &.low {
                            .priority-point:nth-child(3) {
                                background-color: #24C586;
                            }
                        }

                        &.medium {
                            .priority-point:nth-child(3), .priority-point:nth-child(2) {
                                background-color: #fb3;
                            }
                        }

                        &.high {
                            .priority-point {
                                background-color: #e22;
                            }
                        }
                    }

                    .author {
                        font-weight: 600;
                        color: #24C586;
                    }

                    .solver {
                        font-weight: 600;
                        color: #11acff;
                    }

                    .viewed {
                        margin: 0 .25rem;
                        min-width: .5rem;
                        height: .5rem;
                        border-radius: 50%;
                        background-color: #cde;
                        box-shadow: 0 2px 4px #cde5;
                        cursor: pointer;

                        &.not {
                            background-color: #16f;
                        }
                    }

                    .expected-hours {
                        color: #16f;
                    }

                    .replies, .sub-tasks {
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        .reply-count, .sub-task-count {
                            font-weight: normal;
                            color: #24C586;
                            margin-left: .25rem;
                        }

                        .sub-task-count {
                            color: black;
                        }
                    }
                }
            }
        }
    }
</style>
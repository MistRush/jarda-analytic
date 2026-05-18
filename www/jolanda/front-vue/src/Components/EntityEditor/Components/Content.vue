<script setup>
import FormGroupComponent from "@/Components/OldForm/Components/Controls/FormGroup.vue";
import RelationSwitcherComponent from "@/Components/OldForm/Components/Other/RelationSwitcher.vue";
import FormGroup from "@/Components/OldForm/js/Controls/FormGroup";
import RelationSwitcher from "../../OldForm/js/Other/RelationSwitcher";
import SubGridDef from "@/DataGrid/js/SubGridDef";
import SubGridComponent from "@/DataGrid/Components/SubGrid.vue";
import BasePart from "@/Components/OldForm/js/Controls/Parts/BasePart";
import {useTranslations} from "@/Composables/useTranslation.js";

const props = defineProps({
    entityEditor: Object
})

const {translations} = useTranslations();
</script>

<template>
    <form action=""
          :id="entityEditor.getId()"
          :data-datalist-url="entityEditor.getDatalistUrl()"
          :data-datacreate-url="entityEditor.getDatacreateUrl()"
          :data-dataupdate-url="entityEditor.getDataupdateUrl()"
          :data-custom-data="entityEditor.getCustomDataJson()"
    >
        <input name="ID" type="hidden" :value="entityEditor.getEntityId()">
        <template v-for="(tab, index) in entityEditor.getTabs()" :key="index">
            <p v-if="tab.isNotSimple()" class="pl-3">ℹ {{ translations.SAVE_TO_EDIT }}</p>
<!--            {breakIf $tab->isNotSimple()} -->
        </template>
        <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item" :id="'tab-nav-' + tab.getId()" v-for="(tab, index) in entityEditor.getTabs()" :key="index">
                <a
                    class="nav-link"
                    :class="{
                        'active': index === 0,
                        'disabled': tab.isNotSimple()
                    }"
                    :id="'tab-' + tab.getId() + '-link'"
                    data-toggle="tab"
                    :href="'#tab-' + tab.getId()"
                    role="tab"
                    aria-selected="true"
                >
                    {{ tab.getTitle() }}
                    <span class="counter"></span>
                </a>
            </li>
        </ul>
        <div class="header-static-content">
            <div class="tab-pane fade show active" :id="'tab-' + entityEditor.getHeaderTab().getId()" v-if="entityEditor.getHeaderTab()">
                <div class="row">
                    <div
                        v-for="(group, index) in entityEditor.getHeaderTab().getGroups()"
                        :key="index"
                        v-bind="group.getAttributes()"
                    >
                        <template v-for="(groupControl, groupControlIndex) in group.getGroupControls()" :key="groupControlIndex">
<!--                            <template v-if="!(entityEditor.getEntityId() == null && ((groupControl instanceof Grid && groupControl.getDataSaveType() === Grid::SAVE_DATA_SERVERSIDE) || groupControl instanceof RelationSwitcher || groupControl instanceof CategoryTree))">-->
                            <template v-if="groupControl instanceof FormGroup">
                                <FormGroupComponent :form-group="groupControl"/>
                            </template>
                            <template v-else-if="groupControl instanceof RelationSwitcher && entityEditor.getEntityId() != null">
                                <div class="form-group">
                                    <RelationSwitcherComponent :relation-switcher="groupControl"/>
                                </div>
                            </template>
                            <template v-else-if="groupControl instanceof SubGridDef">
                                <div class="form-group">
                                    <SubGridComponent :sub-grid="groupControl"/>
                                </div>
                            </template>
                            <template v-else-if="groupControl instanceof BasePart">
                                <div v-bind="groupControl.attributes" v-html="groupControl.getHtml()"></div>
                            </template>

<!--                            {if $editor->getEntityId() != null && ($control instanceof Jolanda\Controls\Grid\Grid || $control instanceof Jolanda\Controls\Grid\GridVue)}-->
<!--                                {php $control->setDataSaveType(Jolanda\Controls\Grid\Grid::SAVE_DATA_SERVERSIDE)}-->
<!--                            {/if}-->
<!--                            {if !($editor->getEntityId() == null && ((($control instanceof Jolanda\Controls\Grid\Grid || $control instanceof Jolanda\Controls\Grid\GridVue) && $control->getDataSaveType() === Jolanda\Controls\Grid\Grid::SAVE_DATA_SERVERSIDE) || $control instanceof Jolanda\Controls\Grid\RelationSwitcher || $control instanceof Jolanda\Controls\Editor\CategoryTree))}-->
<!--                                {if $control instanceof Jolanda\Controls\Grid\Grid || $control instanceof Jolanda\Controls\Grid\GridVue || $control instanceof Jolanda\Controls\Grid\RelationSwitcher || $control instanceof Jolanda\Controls\Editor\CategoryTree}-->
<!--                                    <div class="form-group">-->
<!--                                        {$control->render()|noescape}-->
<!--                                    </div>-->
<!--                                {else}-->
<!--                                    {$control|noescape}-->
<!--                                {/if}-->
<!--                            {/if}-->
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="tab-content">
            <div
                class="tab-pane fade"
                :class="{
                    'active': index === 0,
                    'show': index === 0,
                }"
                 :id="'tab-' + tab.getId()"
                 v-for="(tab, index) in entityEditor.getTabs()"
                :key="index"
                role="tabpanel"
            >
                <div class="row">
                    <div
                        v-for="(group, groupIndex) in tab.getGroups()"
                        :key="groupIndex"
                        v-bind="group.getAttributes()"
                        :class="{
                            ['col-md-' + group.getColumnSize()]: true,
                            'tab-group': true,
                         }"
                    >
                        <template v-for="(groupControl, groupControlIndex) in group.getGroupControls()" :key="groupControlIndex">
                            <template v-if="groupControl instanceof FormGroup">
                                <FormGroupComponent :form-group="groupControl"/>
                            </template>
                            <template v-else-if="groupControl instanceof RelationSwitcher && entityEditor.getEntityId() != null">
                                <div class="form-group">
                                    <RelationSwitcherComponent :relation-switcher="groupControl"/>
                                </div>
                            </template>
                            <template v-else-if="groupControl instanceof SubGridDef">
                                <div class="form-group">
                                    <SubGridComponent :sub-grid="groupControl"/>
                                </div>
                            </template>
                            <template v-else-if="groupControl instanceof BasePart">
                                <div v-bind="groupControl.attributes" v-html="groupControl.getHtml()"></div>
                            </template>

                            <!--                            {if $editor->getEntityId() != null && ($control instanceof Jolanda\Controls\Grid\Grid || $control instanceof Jolanda\Controls\Grid\GridVue)}-->
                            <!--                                {php $control->setDataSaveType(Jolanda\Controls\Grid\Grid::SAVE_DATA_SERVERSIDE)}-->
                            <!--                            {/if}-->
                            <!--                            {if !($editor->getEntityId() == null && ((($control instanceof Jolanda\Controls\Grid\Grid || $control instanceof Jolanda\Controls\Grid\GridVue) && $control->getDataSaveType() === Jolanda\Controls\Grid\Grid::SAVE_DATA_SERVERSIDE) || $control instanceof Jolanda\Controls\Grid\RelationSwitcher || $control instanceof Jolanda\Controls\Editor\CategoryTree))}-->
                            <!--                                {if $control instanceof Jolanda\Controls\Grid\Grid || $control instanceof Jolanda\Controls\Grid\GridVue || $control instanceof Jolanda\Controls\Grid\RelationSwitcher || $control instanceof Jolanda\Controls\Editor\CategoryTree}-->
                            <!--                                    <div class="form-group">-->
                            <!--                                        {$control->render()|noescape}-->
                            <!--                                    </div>-->
                            <!--                                {else}-->
                            <!--                                    {$control|noescape}-->
                            <!--                                {/if}-->
                            <!--                            {/if}-->
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-static-content">
            <div class="tab-pane fade show active" :id="'tab-' + entityEditor.getFooterTab().getId()" v-if="entityEditor.getFooterTab()">
                <div class="row">
                    <div
                        v-for="(group, index) in entityEditor.getFooterTab().getGroups()"
                        :key="index"
                        v-bind="group.getAttributes()"
                    >
                        <template v-for="(groupControl, groupControlIndex) in group.getGroupControls()" :key="groupControlIndex">
                            <template v-if="groupControl instanceof FormGroup">
                                <FormGroupComponent :form-group="groupControl"/>
                            </template>
                            <template v-else-if="groupControl instanceof RelationSwitcher && entityEditor.getEntityId() != null">
                                <div class="form-group">
                                    <RelationSwitcherComponent :relation-switcher="groupControl"/>
                                </div>
                            </template>
                            <template v-else-if="groupControl instanceof SubGridDef">
                                <div class="form-group">
                                    <SubGridComponent :sub-grid="groupControl"/>
                                </div>
                            </template>
                            <template v-else-if="groupControl instanceof BasePart">
                                <div v-bind="groupControl.attributes" v-html="groupControl.getHtml()"></div>
                            </template>
                            <!--                            {if $editor->getEntityId() != null && ($control instanceof Jolanda\Controls\Grid\Grid || $control instanceof Jolanda\Controls\Grid\GridVue)}-->
                            <!--                                {php $control->setDataSaveType(Jolanda\Controls\Grid\Grid::SAVE_DATA_SERVERSIDE)}-->
                            <!--                            {/if}-->
                            <!--                            {if !($editor->getEntityId() == null && ((($control instanceof Jolanda\Controls\Grid\Grid || $control instanceof Jolanda\Controls\Grid\GridVue) && $control->getDataSaveType() === Jolanda\Controls\Grid\Grid::SAVE_DATA_SERVERSIDE) || $control instanceof Jolanda\Controls\Grid\RelationSwitcher || $control instanceof Jolanda\Controls\Editor\CategoryTree))}-->
                            <!--                                {if $control instanceof Jolanda\Controls\Grid\Grid || $control instanceof Jolanda\Controls\Grid\GridVue || $control instanceof Jolanda\Controls\Grid\RelationSwitcher || $control instanceof Jolanda\Controls\Editor\CategoryTree}-->
                            <!--                                    <div class="form-group">-->
                            <!--                                        {$control->render()|noescape}-->
                            <!--                                    </div>-->
                            <!--                                {else}-->
                            <!--                                    {$control|noescape}-->
                            <!--                                {/if}-->
                            <!--                            {/if}-->
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>